// Task Model
var Task = Backbone.Model.extend({
    defaults: {
        title: '',
        description: '',
        status: 'TODO',
        createdAt: null,
        updatedAt: null
    },
    
    urlRoot: '/api/tasks'
});

// Task Collection
var TaskCollection = Backbone.Collection.extend({
    model: Task,
    url: '/api/tasks',
    
    comparator: function(task) {
        return -new Date(task.get('createdAt')).getTime();
    }
});

// Task Item View
var TaskItemView = Backbone.View.extend({
    template: _.template($('#task-template').html()),
    
    events: {
        'change .status-select': 'updateStatus',
        'click .btn-delete': 'deleteTask'
    },
    
    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },
    
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    
    updateStatus: function(e) {
        var newStatus = $(e.currentTarget).val();
        var self = this;
        
        console.log('Updating task', this.model.get('id'), 'to status:', newStatus);
        
        this.model.save({ status: newStatus }, {
            patch: true,
            success: function(model, response) {
                console.log('Task status updated successfully:', response);
            },
            error: function(model, response) {
                console.error('Error updating task:', response);
                console.error('Response text:', response.responseText);
                console.error('Status code:', response.status);
                alert('Failed to update task status: ' + (response.responseText || response.statusText));
            }
        });
    },
    
    deleteTask: function(e) {
        if (confirm('Are you sure you want to delete this task?')) {
            var self = this;
            this.model.destroy({
                success: function() {
                    console.log('Task deleted successfully');
                },
                error: function(model, response) {
                    console.error('Error deleting task:', response);
                    alert('Failed to delete task');
                }
            });
        }
    }
});

// Task List View
var TaskListView = Backbone.View.extend({
    el: '#task-list',
    
    initialize: function() {
        this.collection = new TaskCollection();
        this.listenTo(this.collection, 'add', this.addOne);
        this.listenTo(this.collection, 'reset', this.addAll);
        this.collection.fetch({ reset: true });
    },
    
    addOne: function(task) {
        var view = new TaskItemView({ model: task });
        this.$el.prepend(view.render().el);
    },
    
    addAll: function() {
        this.$el.empty();
        this.collection.each(this.addOne, this);
    }
});

// Task Form View
var TaskFormView = Backbone.View.extend({
    el: '#task-form',
    
    events: {
        'submit': 'submitForm'
    },
    
    initialize: function(options) {
        this.taskList = options.taskList;
    },
    
    submitForm: function(e) {
        e.preventDefault();
        
        var formData = {
            title: this.$('#task-title').val().trim(),
            description: this.$('#task-description').val().trim(),
            status: this.$('#task-status').val()
        };
        
        if (!formData.title) {
            alert('Title is required');
            return;
        }
        
        var task = new Task(formData);
        var self = this;
        
        task.save(null, {
            success: function(model, response) {
                console.log('Task created successfully:', response);
                self.taskList.collection.add(model);
                self.clearForm();
            },
            error: function(model, response) {
                console.error('Error creating task:', response);
                alert('Failed to create task');
            }
        });
    },
    
    clearForm: function() {
        this.$('#task-title').val('');
        this.$('#task-description').val('');
        this.$('#task-status').val('TODO');
    }
});

// Application Router
var AppRouter = Backbone.Router.extend({
    routes: {
        '': 'home'
    },
    
    home: function() {
        console.log('Home route');
    }
});

// Initialize Application
$(document).ready(function() {
    console.log('Initializing Task Management Application...');
    
    // Create views
    var taskListView = new TaskListView();
    var taskFormView = new TaskFormView({ taskList: taskListView });
    
    // Initialize router
    var router = new AppRouter();
    Backbone.history.start({ pushState: false });
    
    console.log('Application initialized successfully');
});
