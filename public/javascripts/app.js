// API Configuration
var API_ENDPOINTS = {
    play: 'http://localhost:9000/api/tasks',    // Play Framework (Legacy)
    nestjs: 'http://localhost:3000/api/tasks'   // NestJS (Modern)
};

// Task Model
var Task = Backbone.Model.extend({
    defaults: {
        title: '',
        description: '',
        status: 'TODO',
        createdAt: null,
        updatedAt: null
    },
    
    urlRoot: '/api/tasks',
    
    // Override sync to route POST to NestJS
    sync: function(method, model, options) {
        options = options || {};
        if (method === 'create') {
            console.log('[Backbone] Routing POST request to NestJS backend');
            options.url = API_ENDPOINTS.nestjs;
            // NestJS DTO only accepts title, description, status
            options.contentType = 'application/json';
            options.processData = false;
            options.data = JSON.stringify(model.pick('title', 'description', 'status'));
        }
        // All other methods (read, update, delete) go to Play
        return Backbone.sync(method, model, options);
    }
});

// Task Collection
var TaskCollection = Backbone.Collection.extend({
    model: Task,
    url: '/api/tasks',
    
    comparator: function(task) {
        return -new Date(task.get('createdAt')).getTime();
    }
});

// Task Form View (Backbone - keeping this for gradual migration)
var TaskFormView = Backbone.View.extend({
    el: '#task-form',
    
    events: {
        'submit': 'submitForm'
    },
    
    initialize: function(options) {
        this.collection = options.collection;
        console.log('[Backbone] Task form view initialized');
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
        
        console.log('[Backbone] Creating new task:', formData);
        
        var task = new Task(formData);
        var self = this;
        
        task.save(null, {
            success: function(model, response) {
                console.log('[Backbone] Task created successfully:', response);
                // Add to collection - this will notify React via bridge
                self.collection.add(model);
                self.clearForm();
            },
            error: function(model, response) {
                console.error('[Backbone] Error creating task:', response);
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

// Application Router (Backbone - keeping routing layer)
var AppRouter = Backbone.Router.extend({
    routes: {
        '': 'home'
    },
    
    home: function() {
        console.log('[Backbone] Home route');
    }
});

// Initialize Application
$(document).ready(function() {
    console.log('[Backbone] Initializing hybrid Backbone + React application...');
    
    // Create collection
    var taskCollection = new TaskCollection();
    
    // Expose collection globally for bridge
    window.backboneTaskCollection = taskCollection;
    
    // Create Backbone form view (still using Backbone)
    var taskFormView = new TaskFormView({ collection: taskCollection });
    
    // Load initial data
    taskCollection.fetch({ 
        reset: true,
        success: function() {
            console.log('[Backbone] Initial tasks loaded:', taskCollection.length);
        },
        error: function() {
            console.error('[Backbone] Failed to load initial tasks');
        }
    });
    
    // Initialize router
    var router = new AppRouter();
    Backbone.history.start({ pushState: false });
    
    console.log('[Backbone] Backbone initialization complete');
    console.log('[Backbone] React will mount task list via bridge');
});
