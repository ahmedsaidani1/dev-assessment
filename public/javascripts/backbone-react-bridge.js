/**
 * Backbone-React Bridge
 * 
 * This module acts as an adapter between Backbone and React, providing:
 * 1. Data flow from Backbone models to React components
 * 2. Event propagation from React back to Backbone
 * 3. Single source of truth (Backbone models)
 * 4. Observable pattern for real-time updates
 * 
 * Architecture:
 * Backbone Models ──> Bridge ──> React Components
 *       ↑                            │
 *       └────────────────────────────┘
 *            (mutations go back)
 */

class BackboneReactBridge {
    constructor(backboneCollection) {
        this.collection = backboneCollection;
        this.subscribers = [];
        
        console.log('[Bridge] Initializing Backbone-React bridge');
        
        // Listen to Backbone collection events
        this.collection.on('add remove change reset', () => {
            console.log('[Bridge] Backbone collection changed, notifying React subscribers');
            this.notifySubscribers();
        });
    }
    
    /**
     * Subscribe to collection changes
     * Returns unsubscribe function
     */
    subscribe(callback) {
        console.log('[Bridge] New subscriber added');
        this.subscribers.push(callback);
        
        // Return unsubscribe function
        return () => {
            const index = this.subscribers.indexOf(callback);
            if (index > -1) {
                this.subscribers.splice(index, 1);
                console.log('[Bridge] Subscriber removed');
            }
        };
    }
    
    /**
     * Notify all React subscribers of data changes
     */
    notifySubscribers() {
        const tasks = this.collection.toJSON();
        console.log(`[Bridge] Notifying ${this.subscribers.length} subscribers with ${tasks.length} tasks`);
        
        this.subscribers.forEach(callback => {
            callback(tasks);
        });
    }
    
    /**
     * Get current tasks (Promise-based for consistency)
     */
    getTasks() {
        return new Promise((resolve) => {
            const tasks = this.collection.toJSON();
            console.log('[Bridge] getTasks called, returning', tasks.length, 'tasks');
            resolve(tasks);
        });
    }
    
    /**
     * Update task status (delegates to Backbone model)
     */
    updateTaskStatus(taskId, newStatus) {
        return new Promise((resolve, reject) => {
            console.log(`[Bridge] Updating task ${taskId} status to ${newStatus}`);
            
            const task = this.collection.get(taskId);
            if (!task) {
                console.error('[Bridge] Task not found:', taskId);
                reject(new Error('Task not found'));
                return;
            }
            
            // Use Backbone's save method with patch
            task.save({ status: newStatus }, {
                patch: true,
                success: (model, response) => {
                    console.log('[Bridge] Task updated successfully via Backbone');
                    resolve(model.toJSON());
                },
                error: (model, response) => {
                    console.error('[Bridge] Failed to update task:', response);
                    reject(new Error('Failed to update task'));
                }
            });
        });
    }
    
    /**
     * Delete task (delegates to Backbone model)
     */
    deleteTask(taskId) {
        return new Promise((resolve, reject) => {
            console.log(`[Bridge] Deleting task ${taskId}`);
            
            const task = this.collection.get(taskId);
            if (!task) {
                console.error('[Bridge] Task not found:', taskId);
                reject(new Error('Task not found'));
                return;
            }
            
            // Use Backbone's destroy method
            task.destroy({
                success: () => {
                    console.log('[Bridge] Task deleted successfully via Backbone');
                    resolve();
                },
                error: (model, response) => {
                    console.error('[Bridge] Failed to delete task:', response);
                    reject(new Error('Failed to delete task'));
                }
            });
        });
    }
    
    /**
     * Add task (called by Backbone form, notifies React automatically)
     */
    addTask(taskData) {
        return new Promise((resolve, reject) => {
            console.log('[Bridge] Adding new task:', taskData);
            
            const task = new Task(taskData);
            task.save(null, {
                success: (model, response) => {
                    console.log('[Bridge] Task created, adding to collection');
                    this.collection.add(model);
                    resolve(model.toJSON());
                },
                error: (model, response) => {
                    console.error('[Bridge] Failed to create task:', response);
                    reject(new Error('Failed to create task'));
                }
            });
        });
    }
}

// Initialize when document is ready
$(document).ready(function() {
    console.log('[Bridge] Document ready, waiting for Backbone collection and React...');
    
    // Function to mount React
    function mountReact() {
        if (window.backboneTaskCollection && window.ReactTaskList && window.React && window.ReactDOM) {
            console.log('[Bridge] All dependencies loaded, creating bridge');
            
            // Create bridge
            const bridge = new BackboneReactBridge(window.backboneTaskCollection);
            
            // Mount React component
            const container = document.getElementById('react-task-list');
            if (container) {
                console.log('[Bridge] Mounting React component');
                
                const root = ReactDOM.createRoot(container);
                root.render(React.createElement(ReactTaskList, { backboneBridge: bridge }));
                
                console.log('[Bridge] React component mounted successfully');
            } else {
                console.error('[Bridge] Could not find React container');
            }
            
            // Expose bridge globally for debugging
            window.backboneReactBridge = bridge;
        } else {
            console.log('[Bridge] Waiting for dependencies...', {
                backbone: !!window.backboneTaskCollection,
                react: !!window.React,
                reactDOM: !!window.ReactDOM,
                reactTaskList: !!window.ReactTaskList
            });
            // Retry after a short delay
            setTimeout(mountReact, 200);
        }
    }
    
    // Start mounting attempt
    setTimeout(mountReact, 100);
});
