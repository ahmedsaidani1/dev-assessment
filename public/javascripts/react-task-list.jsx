/**
 * React Task List Component
 * 
 * This component replaces the Backbone TaskListView while maintaining
 * compatibility with Backbone models and collections.
 * 
 * Key Features:
 * - Receives data from Backbone collection via bridge
 * - Updates UI reactively when data changes
 * - Communicates back to Backbone for mutations
 * - Modern React patterns (Hooks, functional components)
 */

const { useState, useEffect } = React;

// Individual Task Item Component
function TaskItem({ task, onStatusChange, onDelete }) {
    const [isUpdating, setIsUpdating] = useState(false);
    
    const handleStatusChange = async (e) => {
        setIsUpdating(true);
        try {
            await onStatusChange(task.id, e.target.value);
        } finally {
            setIsUpdating(false);
        }
    };
    
    const handleDelete = async () => {
        if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
            await onDelete(task.id);
        }
    };
    
    const getStatusClass = (status) => {
        return `status-${status.toLowerCase()}`;
    };
    
    return (
        <div className="task-item" data-id={task.id}>
            <div className="task-header">
                <h3 className="task-title">{task.title}</h3>
                <span className={`task-status ${getStatusClass(task.status)}`}>
                    {task.status.replace('_', ' ')}
                </span>
            </div>
            
            {task.description && (
                <p className="task-description">{task.description}</p>
            )}
            
            <div className="task-actions">
                <select 
                    className="status-select" 
                    value={task.status}
                    onChange={handleStatusChange}
                    disabled={isUpdating}
                    data-id={task.id}
                >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                </select>
                <button 
                    className="btn btn-danger btn-delete" 
                    onClick={handleDelete}
                    data-id={task.id}
                >
                    Delete
                </button>
            </div>
            
            <div className="task-meta">
                <small>Created: {new Date(task.createdAt).toLocaleString()}</small>
            </div>
        </div>
    );
}

// Main Task List Component
function ReactTaskList({ backboneBridge }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        console.log('[React] Component mounted, subscribing to Backbone collection');
        
        // Subscribe to Backbone collection changes
        const unsubscribe = backboneBridge.subscribe((updatedTasks) => {
            console.log('[React] Received updated tasks from Backbone:', updatedTasks.length);
            setTasks(updatedTasks);
            setLoading(false);
        });
        
        // Initial load
        backboneBridge.getTasks().then(initialTasks => {
            console.log('[React] Initial tasks loaded:', initialTasks.length);
            setTasks(initialTasks);
            setLoading(false);
        }).catch(err => {
            console.error('[React] Error loading tasks:', err);
            setError('Failed to load tasks');
            setLoading(false);
        });
        
        // Cleanup subscription on unmount
        return () => {
            console.log('[React] Component unmounting, unsubscribing');
            unsubscribe();
        };
    }, [backboneBridge]);
    
    const handleStatusChange = async (taskId, newStatus) => {
        console.log(`[React] Status change requested: Task ${taskId} -> ${newStatus}`);
        try {
            await backboneBridge.updateTaskStatus(taskId, newStatus);
            console.log('[React] Status updated successfully');
        } catch (error) {
            console.error('[React] Failed to update status:', error);
            alert('Failed to update task status');
        }
    };
    
    const handleDelete = async (taskId) => {
        console.log(`[React] Delete requested: Task ${taskId}`);
        try {
            await backboneBridge.deleteTask(taskId);
            console.log('[React] Task deleted successfully');
        } catch (error) {
            console.error('[React] Failed to delete task:', error);
            alert('Failed to delete task');
        }
    };
    
    if (loading) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                <div className="spinner">Loading tasks...</div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#dc3545' }}>
                <p>Error: {error}</p>
            </div>
        );
    }
    
    if (tasks.length === 0) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#999', fontStyle: 'italic' }}>
                No tasks yet. Create your first task above!
            </div>
        );
    }
    
    return (
        <div id="task-list">
            {tasks.map(task => (
                <TaskItem 
                    key={task.id} 
                    task={task}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                />
            ))}
        </div>
    );
}

// Make component globally available for mounting
window.ReactTaskList = ReactTaskList;
console.log('[React] ReactTaskList component loaded');
