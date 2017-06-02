<%@ page contentType="text/html;chartset=UTF-8" language="java" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="java.io.*" %>
<%@ page import="org.springframework.web.multipart.*" %>
<%@ page import="org.springframework.web.multipart.commons.CommonsMultipartResolver" %>
<%@ page import="java.util.*" %>
<%
/**
 * upload.jsp
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/*
#!! IMPORTANT:
#!! this file is just an example, it doesn't incorporate any security checks and
#!! is not recommended to be used in production environment as it is. Be sure to
#!! revise it and customize to your needs.
*/

// Make sure file is not cached (as it happens for example on iOS devices)
response.setHeader("Expires", "Mon, 26 Jul 1997 05:00:00 GMT");
SimpleDateFormat sdf = new SimpleDateFormat("E, dd MM YYYY HH:mm:ss");
response.setHeader("Last-Modified", sdf.format(new Date())+" GMT");
response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
response.setHeader("Cache-Control", "post-check=0, pre-check=0");
response.setHeader("Pragma", "no-cache");

/* 
// Support CORS
header("Access-Control-Allow-Origin: *");
// other CORS headers if any...
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
	exit; // finish preflight CORS requests here
}
*/

// 5 minutes execution time
//@set_time_limit(5 * 60);

// Uncomment this one to fake upload time
// usleep(5000);

// Settings
boolean cleanupTargetDir = true; // Remove old files ?
int maxFileAge = 5 * 3600; // Temp file age in seconds
String tempSuffix = ".part";



// init multipartRequest
MultipartResolver multipartResolver = new CommonsMultipartResolver(session.getServletContext());
if(!multipartResolver.isMultipart(request)) {
    out.write("{\"jsonrpc\" : \"2.0\", \"error\" : {\"code\": 100, \"message\": \"Posted content type must be 'multipart/form-data'.\"}, \"id\" : \"id\"}");
    return;
}
MultipartHttpServletRequest multipartRequest = multipartResolver.resolveMultipart(request);

// init upload dir
String uploadTempDir = multipartRequest.getParameter("upload_tmp_dir");
if(uploadTempDir == null) {
    uploadTempDir = session.getServletContext().getRealPath("/");
}
if(!uploadTempDir.endsWith(File.separator)) {
    uploadTempDir = uploadTempDir + File.separator;
}
String targetDir = uploadTempDir + "uploads";

// Create target dir
File targetDirFile = new File(targetDir);
if(!targetDirFile.exists() && !targetDirFile.mkdirs()) {
    out.write("{\"jsonrpc\" : \"2.0\", \"error\" : {\"code\": 100, \"message\": \"Failed to open temp directory.\"}, \"id\" : \"id\"}");
    return;
}

List<MultipartFile> uploadedFiles = new ArrayList<MultipartFile>();
List<String> uploadedFilenames = new ArrayList<String>();
Iterator<String> uploadFilesIt = multipartRequest.getFileNames();
while(uploadFilesIt.hasNext()) {
    MultipartFile multipartFile = multipartRequest.getFile(uploadFilesIt.next());
    uploadedFiles.add(multipartFile);
    uploadedFilenames.add(multipartFile.getOriginalFilename());
}

if(uploadedFilenames.size() <= 0) {
    out.write("{\"jsonrpc\" : \"2.0\", \"error\" : {\"code\": 101, \"message\": \"Failed to open input stream.\"}, \"id\" : \"id\"}");
    return;
}

// Remove old temp files
if (cleanupTargetDir) {
    File tempFile;
    String tempFilename;
    File[] tempFiles = targetDirFile.listFiles();
    for(int i=0; i<tempFiles.length; i++) {
        tempFile = tempFiles[i];
        tempFilename = tempFile.getName();

        // If temp file is current file proceed to the next
        if (uploadedFilenames.contains(
                tempFilename.endsWith(tempSuffix) ? tempFilename.substring(0, tempFilename.length() - tempSuffix.length()) : tempFilename
        )) {
            continue;
        }

        // Remove temp file if it is older than the max age and is not the current file
        if (tempFilename.endsWith(tempSuffix) && tempFile.lastModified() < System.currentTimeMillis() - maxFileAge) {
            tempFile.delete();
        }
    }
}

// Get a file name
String[] filenames = multipartRequest.getParameterValues("name");

// Chunking might be enabled
String chunkStr = multipartRequest.getParameter("chunk");
int chunk = 0;
if(chunkStr != null && !"".equals(chunkStr)) {
    chunk = Integer.parseInt(chunkStr);
}
String chunksStr = multipartRequest.getParameter("chunks");
int chunks = 0;
if(chunksStr != null && !"".equals(chunksStr)) {
    chunks = Integer.parseInt(chunksStr);
}

FileOutputStream fos = null;
String filepath, tempFilepath, filename;
Iterator<MultipartFile> it = uploadedFiles.iterator();
while (it.hasNext()) {
    MultipartFile curFile = it.next();
    try {
        if(filenames.length <= 0) {
            filename = curFile.getOriginalFilename();
        } else {
            filename = filenames[uploadedFiles.size()%filenames.length];
        }
    } catch (IndexOutOfBoundsException e) {
        filename = curFile.getOriginalFilename();
    }
    filepath = targetDir + File.separator + filename;
    tempFilepath = filepath + tempSuffix;
    File tempFile = new File(tempFilepath);
    try {
        if(chunks != 0) {
            fos = new FileOutputStream(tempFile, true);
        } else {
            fos = new FileOutputStream(tempFile);
        }
        fos.write(curFile.getBytes());
        fos.flush();
    } catch (IOException e) {
        out.write("{\"jsonrpc\" : \"2.0\", \"error\" : {\"code\": 102, \"message\": \"Failed to open output stream.\"}, \"id\" : \"id\"}");
        return;
    } finally {
        try {
            if(fos != null) {
                fos.close();
                fos = null;
            }
        } catch (Exception e) { }

        // Check if file has been uploaded
        if(chunks == 0 || chunk == chunks - 1) {
            File targetFile = new File(filepath);
            if(targetFile.exists()) {
                targetFile.delete();
            }
            tempFile.renameTo(targetFile);
        }
    }
}

// Return Success JSON-RPC response
out.write("{\"jsonrpc\" : \"2.0\", \"result\" : null, \"id\" : \"id\"}");
%>