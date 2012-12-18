package org.rest.client.task;


/**
 * Main idea of Task Loader is to load some tasks on page load.
 * <p>
 * For example app need to update Google Contacts before Send SMS screen shown.
 * Tasks execute some loginc like download data or prepare UI before app is
 * shown to user. Before tasks finish their job user only see "loading screen".
 * This is to prevent freezing of the user interface.
 * </p>
 * 
 * <p>
 * A call with a typical use of <code>LoadTask</code> might look like this:
 * 
 * <pre class="code">
 * public class ContactsTask implements LoadTask {
 * 	
 * 	public int getTasksCount(){
 * 		//this task has 2 inner tasks
 *		return 2; 
 * 	}
 * 
 * 	public void run(final TasksCallback callback){
 *		this.downloadContacts(new AsyncCallback<String>(){
 *			
 *			public void onSuccess(String result){
 *				callback.onInnerTaskFinished();
 *				parseContacts(result,callback);
 *			}
 *
 *			public void onFailure(Throwable caught){
 *				//at this point we do not finish any inner tasks so onFailure should pass 0.  
 *				callback.onFailure(0);
 *			}
 *		});
 * 	}
 * 
 * 	private void parseContacts(String result, TasksCallback callback){
 * 		//do some login here...
 * 		if( ok ) {
 * 			callback.onInnerTaskFinished();
 * 			callback.onSuccess();
 * 		} else {
 * 			//at this point one task has been finished so onFailure should pass 1.
 * 			callback.onFailure(1);
 * 		}
 * 	}
 * }
 * </pre>
 * </p>
 * 
 * @author jarrod
 * 
 */
public interface LoadTask {
	/**
	 * Run the task. After finish each {@link LoadTask} <span
	 * style="color:red;">must to</span> call callback onSuccess method in order
	 * to continue other tasks. If error occur an callback onFailure call
	 * should happen. In this scenario {@link TasksLoader} will try run this
	 * task one time more. After another on failure call task will be removed
	 * from task list.
	 * 
	 * TODO create mechanism that can handle long living tasks (inform loader
	 * about long execution time) and crash handlers.
	 * 
	 * @param callback
	 * @param lastRun true if earlier call result failure and this is final try.
	 */
	void run(TasksCallback callback, boolean lastRun);

	/**
	 * Gat inner tasks count. One task can have more tahn one task inside. After
	 * each task is finished should notify TasksLoader about finished another
	 * task. It's will be count to number of all tasks.
	 * 
	 * @return number of inner tasks
	 */
	int getTasksCount();
	/**
	 * Loader widget.
	 * Tasks can update loader widget UI if needed.
	 * Widget is always set before {@link #run(TasksCallback, boolean)} method
	 * @param loaderWidget
	 */
	void setLoader(LoaderWidget loaderWidget);
}
