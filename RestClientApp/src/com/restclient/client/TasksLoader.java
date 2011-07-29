package com.restclient.client;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.ui.RootPanel;
import com.restclient.client.tasks.LoadTask;
import com.restclient.client.tasks.TasksCallback;
import com.restclient.client.widgets.LoaderWidget;

/**
 * Class provide interface to load data before application can run.
 * Eg. need to update contacts info, get device data etc.
 * It's should be doing in background with loader splash screen
 * an after all tasks return loaded status codes
 * than application should show welcome (or wathever) screen.
 * 
 * 
 * @author jarrod
 *
 */
public class TasksLoader {
	private static boolean running = false;
	/**
	 * Number of tasks on start running
	 */
	private static int initialTasksCount = 0;
	private static int taskFinished = 0;
	private static Callback<Void, Void> appCallback;
	static LoaderWidget widget = null;
	
	/**
	 * Tasks que.
	 */
	private static List<LoadTask> tasks = new ArrayList<LoadTask>();
	/**
	 * Add new loader task.
	 * @param task
	 */
	public static void addTask(LoadTask task){
		tasks.add(task);
	}
	/**
	 * Check if has more tasks.
	 * If there is no more tasks app should remove splash screen an init app.
	 * @return true if loader has more tasks
	 */
	public static boolean hasMoreTasks(){
		return tasks.size() > 0;
	}
	/**
	 * Remove task from que after finish.
	 * @param task
	 */
	private static void removeTask(LoadTask task){
		tasks.remove(task);
	}
	
	public static void runTasks(Callback<Void, Void> callback){
		Void v = GWT.create(Void.class);
		if( !hasMoreTasks() ){
			callback.onSuccess(v);
			return;
		}
		if( running ){
			callback.onFailure(v);
			return;
		}
		running = true;
		
		for( LoadTask task : tasks ){
			initialTasksCount += task.getTasksCount();
		}
		
		appCallback = callback;
		createSplashScreen();
		new Timer() {
			@Override
			public void run() {
				runTasks();
			}
		}.schedule(300);
		
	}
	/**
	 * Create user friendly information about loading page elements.
	 */
	private static void createSplashScreen(){
		RootPanel splash = RootPanel.get("loader-screen");
		if( splash == null ){
			return;
		}
		
		widget = new LoaderWidget();
		splash.add(widget);
		
		
	}
	/**
	 * Remove splash screen.
	 */
	private static void removeSplashScreen(){
		final RootPanel splash = RootPanel.get("loader-screen");
		if( splash != null ){
			splash.addStyleName("fade");
			new Timer() {
				
				@Override
				public void run() {
					splash.getElement().removeFromParent();
					widget = null;
				}
			}.schedule(600);
		}
	}
	
	private static void updateLoader(){
		if( widget == null ){
			return;
		}
		int percent = taskFinished*100/initialTasksCount;
		//Log.debug( initialTasksCount-taskFinished+" tasks left to do of: "+initialTasksCount );
		widget.setProgress(percent);
		
	}
	
	private static void runTasks(){
		
		if( !hasMoreTasks() ){
			running = false;
			Void v = GWT.create(Void.class);
			appCallback.onSuccess(v);
			removeSplashScreen();
			return;
		}
		
		final LoadTask task = tasks.get(0);
		
		callTask(task, true);
		
		
		
	}
	
	private static void callTask(final LoadTask task, final boolean tryAgainOnFailure){
		task.run(new TasksCallback() {
			
			@Override
			public void onSuccess() {
				removeTask(task);
				runTasks();
			}
			
			@Override
			public void onInnerTaskFinished() {
				taskFinished++;
				updateLoader();
			}
			
			@Override
			public void onFailure(int finished) {
				if( tryAgainOnFailure ){
					callTask(task, false);
					return;
				}
				taskFinished += task.getTasksCount() - finished;
				removeTask(task);
				updateLoader();
				runTasks();
			}
		}, !tryAgainOnFailure);
	}
}
