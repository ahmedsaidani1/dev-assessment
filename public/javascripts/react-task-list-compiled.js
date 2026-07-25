/**
 * React Task List Component (Compiled)
 * 
 * This is the compiled version of react-task-list.jsx
 * No Babel needed at runtime
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
    
    return React.createElement(
        'div',
        { className: 'task-item', 'data-id': task.id },
        React.createElement(
            'div',
            { className: 'task-header' },
            React.createElement('h3', { className: 'task-title' }, task.title),
            React.createElement(
                'span',
                { className: `task-status ${getStatusClass(task.status)}` },
                task.status.replace('_', ' ')
            )
        ),
        task.description && React.createElement('p', { className: 'task-description' }, task.description),
        React.createElement(
            'div',
            { className: 'task-actions' },
            React.createElement(
                'select',
                {
                    className: 'status-select',
                    value: task.status,
                    onChange: handleStatusChange,
                    disabled: isUpdating,
                    'data-id': task.id
                },
                React.createElement('option', { value: 'TODO' }, 'To Do'),
                React.createElement('option', { value: 'IN_PROGRESS' }, 'In Progress'),
                React.createElement('option', { value: 'DONE' }, 'Done')
            ),
            React.createElement(
                'button',
                {
                    className: 'btn btn-danger btn-delete',
                    onClick: handleDelete,
                    'data-id': task.id
                },
                'Delete'
            )
        ),
        React.createElement(
            'div',
            { className: 'task-meta' },
            React.createElement('small', null, 'Created: ' + new Date(task.createdAt).toLocaleString())
        )
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
        return React.createElement(
            'div',
            { style: { padding: '2rem', textAlign: 'center', color: '#666' } },
            React.createElement('div', { className: 'spinner' }, 'Loading tasks...')
        );
    }
    
    if (error) {
        return React.createElement(
            'div',
            { style: { padding: '2rem', textAlign: 'center', color: '#dc3545' } },
            React.createElement('p', null, 'Error: ' + error)
        );
    }
    
    if (tasks.length === 0) {
        return React.createElement(
            'div',
            { style: { padding: '3rem', textAlign: 'center', color: '#999', fontStyle: 'italic' } },
            'No tasks yet. Create your first task above!'
        );
    }
    
    return React.createElement(
        'div',
        { id: 'task-list' },
        tasks.map(task => 
            React.createElement(TaskItem, {
                key: task.id,
                task: task,
                onStatusChange: handleStatusChange,
                onDelete: handleDelete
            })
        )
    );
}

// Make component globally available for mounting
window.ReactTaskList = ReactTaskList;
console.log('[React] ReactTaskList component loaded');
