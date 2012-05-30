package org.rest.client.task;

/**
 * The primary interface a caller must implement to receive a response from a
 * {@link LoadTask}.
 * 
 * <p>
 * If an task is successful, then {@link #onSuccess()} is called, otherwise
 * {@link #onFailure()} is called.
 * </p>
 * 
 * <p>
 * Note: {@link #onInnerTaskFinished()} should be called at least once. If
 * {@link LoadTask} has more than one inner task this should be call after each
 * inner task finish it's job.
 * </p>
 * <p>
 * A call with a typical use of <code>TasksCallback</code> might look like this:
 * 
 * <pre class="code">
 * task.run(new TasksCallback() {
 * 	public void onSuccess() {
 * 		TasksLoader.processNext();
 * 	}
 * 
 * 	public void onFailure(int finished) {
 * 		if( tryOnFailure ){
 * 			TasksLoader.tryAgainOrDie();
 * 		} else {
 * 			taskFinished += task.getTasksCount() - finished;
 * 			TasksLoader.notifyUIabautTaskFinish();
 * 		}
 * 	}
 * 
 * 	public void onInnerTaskFinished() {
 * 		// increase loader only
 * 		TasksLoader.notifyUIabautTaskFinish();
 * 	}
 * 
 * });
 * </pre>
 * 
 * </p>
 * 
 * @author jarrod
 * 
 */
public interface TasksCallback {
	/**
	 * Called when an task call fails to complete normally.
	 * <p>
	 * {@link TasksLoader} should than try to run task one more time. If task
	 * fails to complete again than {@link TasksLoader} remove task from tasks
	 * que and continue.
	 * </p>
	 * 
	 */
	void onFailure(int tasksExecutedCount);

	/**
	 * Called when an task call completes successfully.
	 * <p>
	 * After this call {@link TasksLoader} remove task from tasks que and
	 * continue with next task.
	 * </p>
	 * <p>
	 * There is no way (yet) to implement fatal error about task. You can't
	 * notify user about something go wrong. If that widgets should handle
	 * errors by themselfs.
	 * </p>
	 */
	void onSuccess();

	/**
	 * Called when each inner task is finished. If task has only one inner task its
	 * should be executed before {@link #onSuccess()} is called.
	 */
	void onInnerTaskFinished();
}
