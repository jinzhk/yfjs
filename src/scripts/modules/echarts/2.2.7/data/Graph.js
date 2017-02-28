define('echarts2/data/Graph', [
    'require',
    'zrender2/tool/util'
], function (require) {
    var util = require('zrender2/tool/util');
    'use strict';
    var Graph = function (directed) {
        this._directed = directed || false;
        this.nodes = [];
        this.edges = [];
        this._nodesMap = {};
        this._edgesMap = {};
    };
    Graph.prototype.isDirected = function () {
        return this._directed;
    };
    Graph.prototype.addNode = function (id, data) {
        if (this._nodesMap[id]) {
            return this._nodesMap[id];
        }
        var node = new Graph.Node(id, data);
        this.nodes.push(node);
        this._nodesMap[id] = node;
        return node;
    };
    Graph.prototype.getNodeById = function (id) {
        return this._nodesMap[id];
    };
    Graph.prototype.addEdge = function (n1, n2, data) {
        if (typeof n1 == 'string') {
            n1 = this._nodesMap[n1];
        }
        if (typeof n2 == 'string') {
            n2 = this._nodesMap[n2];
        }
        if (!n1 || !n2) {
            return;
        }
        var key = n1.id + '-' + n2.id;
        if (this._edgesMap[key]) {
            return this._edgesMap[key];
        }
        var edge = new Graph.Edge(n1, n2, data);
        if (this._directed) {
            n1.outEdges.push(edge);
            n2.inEdges.push(edge);
        }
        n1.edges.push(edge);
        if (n1 !== n2) {
            n2.edges.push(edge);
        }
        this.edges.push(edge);
        this._edgesMap[key] = edge;
        return edge;
    };
    Graph.prototype.removeEdge = function (edge) {
        var n1 = edge.node1;
        var n2 = edge.node2;
        var key = n1.id + '-' + n2.id;
        if (this._directed) {
            n1.outEdges.splice(util.indexOf(n1.outEdges, edge), 1);
            n2.inEdges.splice(util.indexOf(n2.inEdges, edge), 1);
        }
        n1.edges.splice(util.indexOf(n1.edges, edge), 1);
        if (n1 !== n2) {
            n2.edges.splice(util.indexOf(n2.edges, edge), 1);
        }
        delete this._edgesMap[key];
        this.edges.splice(util.indexOf(this.edges, edge), 1);
    };
    Graph.prototype.getEdge = function (n1, n2) {
        if (typeof n1 !== 'string') {
            n1 = n1.id;
        }
        if (typeof n2 !== 'string') {
            n2 = n2.id;
        }
        if (this._directed) {
            return this._edgesMap[n1 + '-' + n2];
        } else {
            return this._edgesMap[n1 + '-' + n2] || this._edgesMap[n2 + '-' + n1];
        }
    };
    Graph.prototype.removeNode = function (node) {
        if (typeof node === 'string') {
            node = this._nodesMap[node];
            if (!node) {
                return;
            }
        }
        delete this._nodesMap[node.id];
        this.nodes.splice(util.indexOf(this.nodes, node), 1);
        for (var i = 0; i < this.edges.length;) {
            var edge = this.edges[i];
            if (edge.node1 === node || edge.node2 === node) {
                this.removeEdge(edge);
            } else {
                i++;
            }
        }
    };
    Graph.prototype.filterNode = function (cb, context) {
        var len = this.nodes.length;
        for (var i = 0; i < len;) {
            if (cb.call(context, this.nodes[i], i)) {
                i++;
            } else {
                this.removeNode(this.nodes[i]);
                len--;
            }
        }
    };
    Graph.prototype.filterEdge = function (cb, context) {
        var len = this.edges.length;
        for (var i = 0; i < len;) {
            if (cb.call(context, this.edges[i], i)) {
                i++;
            } else {
                this.removeEdge(this.edges[i]);
                len--;
            }
        }
    };
    Graph.prototype.eachNode = function (cb, context) {
        var len = this.nodes.length;
        for (var i = 0; i < len; i++) {
            if (this.nodes[i]) {
                cb.call(context, this.nodes[i], i);
            }
        }
    };
    Graph.prototype.eachEdge = function (cb, context) {
        var len = this.edges.length;
        for (var i = 0; i < len; i++) {
            if (this.edges[i]) {
                cb.call(context, this.edges[i], i);
            }
        }
    };
    Graph.prototype.clear = function () {
        this.nodes.length = 0;
        this.edges.length = 0;
        this._nodesMap = {};
        this._edgesMap = {};
    };
    Graph.prototype.breadthFirstTraverse = function (cb, startNode, direction, context) {
        if (typeof startNode === 'string') {
            startNode = this._nodesMap[startNode];
        }
        if (!startNode) {
            return;
        }
        var edgeType = 'edges';
        if (direction === 'out') {
            edgeType = 'outEdges';
        } else if (direction === 'in') {
            edgeType = 'inEdges';
        }
        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].__visited = false;
        }
        if (cb.call(context, startNode, null)) {
            return;
        }
        var queue = [startNode];
        while (queue.length) {
            var currentNode = queue.shift();
            var edges = currentNode[edgeType];
            for (var i = 0; i < edges.length; i++) {
                var e = edges[i];
                var otherNode = e.node1 === currentNode ? e.node2 : e.node1;
                if (!otherNode.__visited) {
                    if (cb.call(otherNode, otherNode, currentNode)) {
                        return;
                    }
                    queue.push(otherNode);
                    otherNode.__visited = true;
                }
            }
        }
    };
    Graph.prototype.clone = function () {
        var graph = new Graph(this._directed);
        for (var i = 0; i < this.nodes.length; i++) {
            graph.addNode(this.nodes[i].id, this.nodes[i].data);
        }
        for (var i = 0; i < this.edges.length; i++) {
            var e = this.edges[i];
            graph.addEdge(e.node1.id, e.node2.id, e.data);
        }
        return graph;
    };
    var Node = function (id, data) {
        this.id = id;
        this.data = data || null;
        this.inEdges = [];
        this.outEdges = [];
        this.edges = [];
    };
    Node.prototype.degree = function () {
        return this.edges.length;
    };
    Node.prototype.inDegree = function () {
        return this.inEdges.length;
    };
    Node.prototype.outDegree = function () {
        return this.outEdges.length;
    };
    var Edge = function (node1, node2, data) {
        this.node1 = node1;
        this.node2 = node2;
        this.data = data || null;
    };
    Graph.Node = Node;
    Graph.Edge = Edge;
    Graph.fromMatrix = function (nodesData, matrix, directed) {
        if (!matrix || !matrix.length || matrix[0].length !== matrix.length || nodesData.length !== matrix.length) {
            return;
        }
        var size = matrix.length;
        var graph = new Graph(directed);
        for (var i = 0; i < size; i++) {
            var node = graph.addNode(nodesData[i].id, nodesData[i]);
            node.data.value = 0;
            if (directed) {
                node.data.outValue = node.data.inValue = 0;
            }
        }
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                var item = matrix[i][j];
                if (directed) {
                    graph.nodes[i].data.outValue += item;
                    graph.nodes[j].data.inValue += item;
                }
                graph.nodes[i].data.value += item;
                graph.nodes[j].data.value += item;
            }
        }
        for (var i = 0; i < size; i++) {
            for (var j = i; j < size; j++) {
                var item = matrix[i][j];
                if (item === 0) {
                    continue;
                }
                var n1 = graph.nodes[i];
                var n2 = graph.nodes[j];
                var edge = graph.addEdge(n1, n2, {});
                edge.data.weight = item;
                if (i !== j) {
                    if (directed && matrix[j][i]) {
                        var inEdge = graph.addEdge(n2, n1, {});
                        inEdge.data.weight = matrix[j][i];
                    }
                }
            }
        }
        return graph;
    };
    return Graph;
});