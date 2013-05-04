package org.rest.client.codemirror;

import com.google.gwt.core.client.JavaScriptObject;

public class CodeMirrorOptions extends JavaScriptObject {
	protected CodeMirrorOptions() {
	}

	public static final native CodeMirrorOptions create() /*-{
		return {};
	}-*/;

	/**
	 * @param value
	 *            The starting value of the editor.
	 */
	public final native void setValue(String value) /*-{
		this.value = value;
	}-*/;

	/**
	 * 
	 * @param mode
	 *            The mode to use. When not given, this will default to the
	 *            first mode that was loaded. It may be a string, which either
	 *            simply names the mode or is a MIME type associated with the
	 *            mode.
	 */
	public final native void setMode(String mode) /*-{
		this.mode = mode;
	}-*/;

	/**
	 * @param theme
	 *            The theme to style the editor with. You must make sure the CSS
	 *            file defining the corresponding .cm-s-[name] styles is loaded
	 *            (see the theme directory in the distribution). The default is
	 *            "default", for which colors are included in codemirror.css. It
	 *            is possible to use multiple theming classes at once—for
	 *            example "foo bar" will assign both the cm-s-foo and the
	 *            cm-s-bar classes to the editor.
	 */
	public final native void setTheme(String theme) /*-{
		this.theme = theme;
	}-*/;

	/**
	 * @param indentUnit
	 *            How many spaces a block (whatever that means in the edited
	 *            language) should be indented. The default is 2.
	 */
	public final native void setIndentUnit(int indentUnit) /*-{
		this.indentUnit = indentUnit;
	}-*/;

	/**
	 * @param smartIndent
	 *            Whether to use the context-sensitive indentation that the mode
	 *            provides (or just indent the same as the line before).
	 *            Defaults to true.
	 */
	public final native void setSmartIndent(boolean smartIndent) /*-{
		this.smartIndent = smartIndent;
	}-*/;

	/**
	 * @param tabSize
	 *            The width of a tab character. Defaults to 4.
	 */
	public final native void setTabSize(int tabSize) /*-{
		this.tabSize = tabSize;
	}-*/;

	/**
	 * @param indentWithTabs
	 *            Whether, when indenting, the first N*tabSize spaces should be
	 *            replaced by N tabs. Default is false.
	 */
	public final native void setIndentWithTabs(boolean indentWithTabs) /*-{
		this.indentWithTabs = indentWithTabs;
	}-*/;

	/**
	 * @param electricChars
	 *            Configures whether the editor should re-indent the current
	 *            line when a character is typed that might change its proper
	 *            indentation (only works if the mode supports indentation).
	 *            Default is true.
	 */
	public final native void setElectricChars(boolean electricChars) /*-{
		this.electricChars = electricChars;
	}-*/;

	/**
	 * @param autoClearEmptyLines
	 *            When turned on (default is off), this will automatically clear
	 *            lines consisting only of whitespace when the cursor leaves
	 *            them. This is mostly useful to prevent auto indentation from
	 *            introducing trailing whitespace in a file.
	 */
	public final native void setAutoClearEmptyLines(boolean autoClearEmptyLines) /*-{
		this.autoClearEmptyLines = autoClearEmptyLines;
	}-*/;

	/**
	 * See the section on <a
	 * href="http://codemirror.net/doc/manual.html#keymaps">keymaps</a> for more
	 * information.
	 * 
	 * @param keyMap
	 *            Configures the keymap to use. The default is "default", which
	 *            is the only keymap defined in codemirror.js itself. Extra
	 *            keymaps are found in the keymap directory.
	 */
	public final native void setKeyMap(String keyMap) /*-{
		this.keyMap = keyMap;
	}-*/;

	/**
	 * @param lineWrapping
	 *            Whether CodeMirror should scroll or wrap for long lines.
	 *            Defaults to false (scroll).
	 */
	public final native void setLineWrapping(boolean lineWrapping) /*-{
		this.lineWrapping = lineWrapping;
	}-*/;

	/**
	 * 
	 * @param lineNumbers
	 *            Whether to show line numbers to the left of the editor.
	 */
	public final native void setLineNumbers(boolean lineNumbers) /*-{
		this.lineNumbers = lineNumbers;
	}-*/;

	/**
	 * 
	 * @param firstLineNumber
	 *            At which number to start counting lines. Default is 1.
	 */
	public final native void setFirstLineNumber(int firstLineNumber) /*-{
		this.firstLineNumber = firstLineNumber;
	}-*/;

	/**
	 * 
	 * @param gutter
	 *            Can be used to force a 'gutter' (empty space on the left of
	 *            the editor) to be shown even when no line numbers are active.
	 *            This is useful for setting markers.
	 */
	public final native void setGutter(boolean gutter) /*-{
		this.gutter = gutter;
	}-*/;

	/**
	 * @param fixedGutter
	 *            When enabled (off by default), this will make the gutter stay
	 *            visible when the document is scrolled horizontally.
	 */
	public final native void setFixedGutter(boolean fixedGutter) /*-{
		this.fixedGutter = fixedGutter;
	}-*/;

	/**
	 * 
	 * @param readOnly
	 *            This disables editing of the editor content by the user. If
	 *            the special value "nocursor" is given (instead of simply
	 *            true), focusing of the editor is also disallowed.
	 */
	public final native void setReadOnly(boolean readOnly) /*-{
		this.readOnly = readOnly;
	}-*/;

	/**
	 * 
	 * @param matchBrackets
	 *            Determines whether brackets are matched whenever the cursor is
	 *            moved next to a bracket.
	 */
	public final native void setMatchBrackets(boolean matchBrackets) /*-{
		this.matchBrackets = matchBrackets;
	}-*/;

	/**
	 * 
	 * @param cursorBlinkRate
	 *            Half-period in milliseconds used for cursor blinking. The
	 *            default blink rate is 530ms.
	 */
	public final native void setCursorBlinkRate(int cursorBlinkRate) /*-{
		this.cursorBlinkRate = cursorBlinkRate;
	}-*/;

	/**
	 * 
	 * @param workTime
	 *            Highlighting is done by a pseudo background-thread that will
	 *            work for workTime milliseconds, and then use timeout to sleep
	 *            for {@link #setWorkDelay(int)} milliseconds. The defaults are
	 *            200 and 300, you can change these options to make the
	 *            highlighting more or less aggressive.
	 */
	public final native void setWorkTime(int workTime) /*-{
		this.workTime = workTime;
	}-*/;

	/**
	 * 
	 * @param workDelay
	 *            Highlighting is done by a pseudo background-thread that will
	 *            work for {@link #setWorkTime(int)} milliseconds, and then use
	 *            timeout to sleep for workDelay milliseconds. The defaults are
	 *            200 and 300, you can change these options to make the
	 *            highlighting more or less aggressive.
	 */
	public final native void setWorkDelay(int workDelay) /*-{
		this.workDelay = workDelay;
	}-*/;

	/**
	 * 
	 * @param pollInterval
	 *            Indicates how quickly CodeMirror should poll its input
	 *            textarea for changes. Most input is captured by events, but
	 *            some things, like IME input on some browsers, doesn't generate
	 *            events that allow CodeMirror to properly detect it. Thus, it
	 *            polls. Default is 100 milliseconds.
	 */
	public final native void setPollInterval(int pollInterval) /*-{
		this.pollInterval = pollInterval;
	}-*/;

	/**
	 * 
	 * @param undoDepth
	 *            The maximum number of undo levels that the editor stores.
	 *            Defaults to 40.
	 */
	public final native void setUndoDepth(int undoDepth) /*-{
		this.undoDepth = undoDepth;
	}-*/;

	/**
	 * 
	 * @param tabindex
	 *            The tab index to assign to the editor. If not given, no tab
	 *            index will be assigned.
	 */
	public final native void setTabindex(int tabindex) /*-{
		this.tabindex = tabindex;
	}-*/;

	/**
	 * 
	 * @param autofocus
	 *            Can be used to make CodeMirror focus itself on initialization.
	 *            Defaults to off. When fromTextArea is used, and no explicit
	 *            value is given for this option, it will be set to true when
	 *            either the source textarea is focused, or it has an autofocus
	 *            attribute and no other element is focused.
	 */
	public final native void setAutofocus(boolean autofocus) /*-{
		this.autofocus = autofocus;
	}-*/;

	/**
	 * @param dragDrop
	 *            Controls whether drag-and-drop is enabled. On by default.
	 */
	public final native void setDragDrop(boolean dragDrop) /*-{
		this.dragDrop = dragDrop;
	}-*/;

	/**
	 * Can be used to specify extra keybindings for the editor, alongside the
	 * ones defined by keyMap. Should be either null, or a valid keymap value.
	 * 
	 * @param extraKeys
	 */
	public final native void setExtraKeys(CodeMirrorKeyMap extraKeys) /*-{
		this.extraKeys = extraKeys;
	}-*/;

}
