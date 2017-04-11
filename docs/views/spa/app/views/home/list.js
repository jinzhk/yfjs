define(['App', 'bs/modal', 'jq/dataTables-bs3'], function(App, Modal) {
    return App.View({
        data: App.remote("/data/profile-list.json"),
        dataFilter: function(err, resp) {
            if (err) {
                return {data: []};
            } else {
                return {data: resp || []};
            }
        },
        ready: function() {
            var self = this,
                $table = this.$('#table-list');
            var tableApi = $table.DataTable({
                data: this.getData('data'),
                columns: [
                    {
                        render: function(data, type, rowData, cellApi) {
                            return cellApi.row + 1;
                        }
                    },
                    {
                        data: "firstName"
                    },
                    {
                        data: "lastName"
                    },
                    {
                        data: "userName"
                    },
                    {
                        render: function(data, type, rowData, cellApi) {
                            return (
                                '<a class="btn btn-edit">' +
                                    '<i class="fa fa-pencil-square-o"></i>' +
                                '</a>' +
                                '<a class="btn btn-delete">' +
                                    '<i class="fa fa-trash"></i>' +
                                '</a>'
                            );
                        }
                    }
                ],
                initComplete: function() {
                    self.set('tableApi', $table.dataTable().api());
                    self.bind('click', ".btn-add", self.addItem);
                    self.bind('click', $('.btn-edit', $table), self.editItem);
                    self.bind('click', $('.btn-delete', $table), self.deleteItem);
                }
            });
        },
        addItem: function() {
            var self = this;
            Modal.show({
                title: "添加项",
                remote: function() {
                    var def = $.Deferred();
                    self.render(App.remote('+/add.html'), function(err, html) {
                        def.resolve(html);
                    });
                    return def.promise();
                },
                loaded: function() {
                    // 弹出框内容处理
                },
                buttons: [
                    {
                        label: "取消",
                        action: function(dialog) {
                            dialog.close();
                        }
                    },
                    {
                        label: "添加",
                        cssClass: "btn-primary",
                        action: function(dialog) {
                            if (self.tableApi) {
                                var $dialog = dialog.getModalDialog(),
                                    $form = $("#form-add", $dialog);
                                var $firstName = $("#firstName", $form),
                                    $lastName = $("#lastName", $form),
                                    $userName = $("#userName", $form);
                                self.tableApi.row.add({
                                    firstName: $firstName.val() || "N/A",
                                    lastName: $lastName.val() || "N/A",
                                    userName: $userName.val() || "N/A"
                                }).draw();
                            }
                            dialog.close();
                        }
                    }
                ]
            });
        },
        editItem: function(e) {
            if (!this.tableApi) return this;
            var self = this,
                $this = $(e.currentTarget),
                $tr = $this.parents("tr:first");
            var rowApi = this.tableApi.row($tr),
                rowData = rowApi.data() || {};
            Modal.show({
                title: "添加项",
                remote: function() {
                    var def = $.Deferred();
                    self.render(App.remote('+/edit.html'), rowData, function(err, html) {
                        def.resolve(html);
                    });
                    return def.promise();
                },
                loaded: function() {
                    // 弹出狂内容处理
                },
                buttons: [
                    {
                        label: "取消",
                        action: function(dialog) {
                            dialog.close();
                        }
                    },
                    {
                        label: "编辑",
                        cssClass: "btn-primary",
                        action: function(dialog) {
                            if (self.tableApi) {
                                var $dialog = dialog.getModalDialog(),
                                    $form = $("#form-edit", $dialog);
                                var $firstName = $("#firstName", $form),
                                    $lastName = $("#lastName", $form),
                                    $userName = $("#userName", $form);
                                rowApi.data({
                                    firstName: $firstName.val() || "N/A",
                                    lastName: $lastName.val() || "N/A",
                                    userName: $userName.val() || "N/A"
                                }).draw();
                            }
                            dialog.close();
                        }
                    }
                ]
            });
        },
        deleteItem: function(e) {
            if (!this.tableApi) return this;
            var $this = $(e.currentTarget),
                $tr = $this.parents("tr:first");
            var rowApi = this.tableApi.row($tr),
                rowData = rowApi.data();
            var keywords = rowData.lastName + " " + rowData.firstName + rowData.userName;
            Modal.confirm("确定删除用户 " + keywords + " 吗？", function(bsure) {
                if (bsure) {
                    rowApi.remove().draw();
                }
            });
        },
        tableApi: null
    });
});