package org.rest.client.resources;

import com.google.gwt.core.client.GWT;
import com.google.gwt.resources.client.ResourcePrototype;

public class AppResources_default_InlineClientBundleGenerator implements org.rest.client.resources.AppResources {
  private static AppResources_default_InlineClientBundleGenerator _instance0 = new AppResources_default_InlineClientBundleGenerator();
  private void appCssInitializer() {
    appCss = new org.rest.client.resources.AppCssResource() {
      private boolean injected;
      public boolean ensureInjected() {
        if (!injected) {
          injected = true;
          com.google.gwt.dom.client.StyleInjector.inject(getText());
          return true;
        }
        return false;
      }
      public String getName() {
        return "appCss";
      }
      public String getText() {
        return com.google.gwt.i18n.client.LocaleInfo.getCurrentLocale().isRTL() ? ((".GD-EPHMFJ{height:" + ((AppResources_default_InlineClientBundleGenerator.this.handlerArrowRight()).getHeight() + "px")  + ";width:" + ((AppResources_default_InlineClientBundleGenerator.this.handlerArrowRight()).getWidth() + "px")  + ";overflow:" + ("hidden")  + ";background:" + ("url(\"" + (AppResources_default_InlineClientBundleGenerator.this.handlerArrowRight()).getSafeUri().asString() + "\") -" + (AppResources_default_InlineClientBundleGenerator.this.handlerArrowRight()).getLeft() + "px -" + (AppResources_default_InlineClientBundleGenerator.this.handlerArrowRight()).getTop() + "px  no-repeat")  + ";background-position:" + ("1px"+ " " +"center")  + ";}.GD-EPHMHJ{height:" + ((AppResources_default_InlineClientBundleGenerator.this.handlerArrowDown()).getHeight() + "px")  + ";width:" + ((AppResources_default_InlineClientBundleGenerator.this.handlerArrowDown()).getWidth() + "px")  + ";overflow:" + ("hidden")  + ";background:" + ("url(\"" + (AppResources_default_InlineClientBundleGenerator.this.handlerArrowDown()).getSafeUri().asString() + "\") -" + (AppResources_default_InlineClientBundleGenerator.this.handlerArrowDown()).getLeft() + "px -" + (AppResources_default_InlineClientBundleGenerator.this.handlerArrowDown()).getTop() + "px  no-repeat")  + ";background-position:" + ("3px"+ " " +"center")  + ";}.GD-EPHMJJ{font-style:") + (("italic")  + ";}.GD-EPHMGJ{width:" + ("15px")  + ";height:" + ("24px")  + ";display:" + ("-webkit-box")  + ";cursor:" + ("pointer")  + ";}.GD-EPHMGJ:hover{background-color:" + ("#eee")  + ";}.GD-EPHMFK{margin-top:" + ("10px")  + ";margin-left:" + ("5px")  + ";}.GD-EPHMFK>.GD-EPHMDK{display:" + ("-webkit-box")  + ";}.GD-EPHMFK>.GD-EPHMDK>.GD-EPHMBK{display:" + ("block")  + ";padding:" + ("4px"+ " " +"18px"+ " " +"3px"+ " " +"18px") ) + (";margin-left:" + ("2px")  + ";border-top-right-radius:" + ("3px"+ " " +"3px")  + ";border-top-left-radius:" + ("3px"+ " " +"3px")  + ";color:" + ("blue")  + ";text-decoration:" + ("none")  + ";cursor:" + ("pointer")  + ";}.GD-EPHMFK .GD-EPHMOJ{display:" + ("-webkit-box")  + ";-webkit-box-pack:" + ("end")  + ";-webkit-box-flex:" + ("1")  + ";font-weight:" + ("bold")  + ";-webkit-box-align:") + (("center")  + ";-webkit-padding-end:" + ("14px")  + ";}.GD-EPHMFK>.GD-EPHMDK>.GD-EPHMBK.GD-EPHMCK{background-color:" + ("#ccc")  + ";color:" + ("black")  + ";}.GD-EPHMFK>.GD-EPHMEK{border:" + ("1px"+ " " +"#ccc"+ " " +"solid")  + ";display:" + ("-webkit-box")  + ";-webkit-box-orient:" + ("horizontal")  + ";min-height:" + ("100px")  + ";}.GD-EPHMFK>.GD-EPHMEK>.GD-EPHMPJ{display:" + ("none")  + ";}.GD-EPHMFK>.GD-EPHMEK>.GD-EPHMPJ.GD-EPHMAK{display:" + ("block")  + ";width:" + ("100%") ) + (";height:" + ("100%")  + ";}.GD-EPHMAJ,.GD-EPHMLJ{margin:" + ("5px"+ " " +"0"+ " " +"7px"+ " " +"4px")  + ";padding:" + ("2px"+ " " +"6px")  + ";border:" + ("1px"+ " " +"#e5e5e5"+ " " +"solid")  + ";cursor:" + ("pointer")  + ";}.GD-EPHMCJ .GD-EPHMLJ{display:" + ("-webkit-inline-box")  + ";}.GD-EPHMAJ:hover,.GD-EPHMLJ:hover{border-color:" + ("#999")  + ";background-color:" + ("#eaeaea")  + ";}.GD-EPHMMJ{-webkit-appearance:" + ("button")  + ";-webkit-border-radius:" + ("2px")  + ";-webkit-box-shadow:") + (("0"+ " " +"1px"+ " " +"3px"+ " " +"rgba(0,0,0,0.1)")  + ";background-image:" + ("url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAICAYAAADJEc7MAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjA5MDMwMzEzMUVBRTExRTA5NUM0QzJENTZCN0I5Mjk1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjA5MDMwMzE0MUVBRTExRTA5NUM0QzJENTZCN0I5Mjk1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDkwMzAzMTExRUFFMTFFMDk1QzRDMkQ1NkI3QjkyOTUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDkwMzAzMTIxRUFFMTFFMDk1QzRDMkQ1NkI3QjkyOTUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5pY8xsAAAAbUlEQVR42mL8//8/AzmAEYijgJgHj5ovQMOXYYgmAgEzM/M3IPM/OgaJg+RBrkLHIEJhwYIFC9nY2H4iawLxQeIgeVwaMTQT0oSsEa6Zj4/vCyFN6BrBmt++fdtESBMIM2KJDlYg/k0oOgACDABJirkKokz/DAAAAABJRU5ErkJggg==), -webkit-linear-gradient(#FAFAFA, #F4F4F4 40%, #E5E5E5)")  + ";background-position:" + ("center"+ " " +"left")  + ";background-repeat:" + ("no-repeat")  + ";border:" + ("1px"+ " " +"solid"+ " " +"#aaa")  + ";color:" + ("#555")  + ";font-size:" + ("inherit")  + ";margin:" + ("0")  + ";overflow:" + ("hidden")  + ";padding:" + ("2px"+ " " +"5px"+ " " +"2px"+ " " +"20px")  + ";text-overflow:" + ("ellipsis") ) + (";white-space:" + ("nowrap")  + ";}.GD-EPHMOI{margin:" + ("7px")  + ";display:" + ("inline-block")  + ";}.GD-EPHMCJ,.GD-EPHMCJ>*{display:" + ("-webkit-box")  + ";}.GD-EPHMDJ{-webkit-box-flex:" + ("1")  + ";}.GD-EPHMIJ{display:" + ("none")  + " !important;}.GD-EPHMNJ{background-color:" + ("#d14836")  + ";background-image:" + ("-webkit-linear-gradient(top,#dd4b39,#d14836)")  + ";background-image:" + ("-moz-linear-gradient(top,#dd4b39,#d14836)")  + ";background-image:" + ("-ms-linear-gradient(top,#dd4b39,#d14836)")  + ";background-image:") + (("-o-linear-gradient(top,#dd4b39,#d14836)")  + ";background-image:" + ("linear-gradient(top,#dd4b39,#d14836)")  + ";border:" + ("1px"+ " " +"solid"+ " " +"transparent")  + ";color:" + ("white")  + ";text-shadow:" + ("0"+ " " +"1px"+ " " +"rgba(0,0,0,0.1)")  + ";text-transform:" + ("uppercase")  + ";text-shadow:" + ("0"+ " " +"1px"+ " " +"rgba(0,0,0,0.1)")  + ";padding:" + ("7px"+ " " +"20px")  + ";margin:" + ("15px"+ " " +"7px")  + ";}.GD-EPHMNJ:hover{-moz-box-shadow:" + ("0"+ " " +"1px"+ " " +"1px"+ " " +"rgba(0,0,0,0.2)")  + ";-webkit-box-shadow:" + ("0"+ " " +"1px"+ " " +"1px"+ " " +"rgba(0,0,0,0.2)") ) + (";-ms-box-shadow:" + ("0"+ " " +"1px"+ " " +"1px"+ " " +"rgba(0,0,0,0.2)")  + ";box-shadow:" + ("0"+ " " +"1px"+ " " +"1px"+ " " +"rgba(0,0,0,0.2)")  + ";}.GD-EPHMNJ:active{-webkit-box-shadow:" + ("inset"+ " " +"0"+ " " +"1px"+ " " +"2px"+ " " +"rgba(0,0,0,0.3)")  + ";-moz-box-shadow:" + ("inset"+ " " +"0"+ " " +"1px"+ " " +"2px"+ " " +"rgba(0,0,0,0.3)")  + ";box-shadow:" + ("inset"+ " " +"0"+ " " +"1px"+ " " +"2px"+ " " +"rgba(0,0,0,0.3)")  + ";background-color:" + ("#b0281a")  + ";background-image:" + ("-webkit-linear-gradient(top,#dd4b39,#b0281a)")  + ";background-image:" + ("-moz-linear-gradient(top,#dd4b39,#b0281a)")  + ";background-image:" + ("-ms-linear-gradient(top,#dd4b39,#b0281a)")  + ";background-image:" + ("-o-linear-gradient(top,#dd4b39,#b0281a)")  + ";background-image:") + (("linear-gradient(top,#dd4b39,#b0281a)")  + ";border:" + ("1px"+ " " +"solid"+ " " +"#992a1b")  + ";}.GD-EPHMNJ:FOCUS{border:" + ("1px"+ " " +"solid"+ " " +"transparent")  + ";outline:" + ("0"+ " " +"transparent")  + ";-webkit-box-shadow:" + ("inset"+ " " +"0"+ " " +"0"+ " " +"0"+ " " +"1px"+ " " +"white")  + ";-moz-box-shadow:" + ("inset"+ " " +"0"+ " " +"0"+ " " +"0"+ " " +"1px"+ " " +"#fff")  + ";box-shadow:" + ("inset"+ " " +"0"+ " " +"0"+ " " +"0"+ " " +"1px"+ " " +"white")  + ";}.GD-EPHMNJ.GD-EPHMEJ{background-color:" + ("#27ac27")  + ";background-image:" + ("-webkit-linear-gradient(top,#27ac27,#349734)")  + ";background-image:" + ("-moz-linear-gradient(top,#27ac27,#349734)")  + ";background-image:" + ("-ms-linear-gradient(top,#27ac27,#349734)") ) + (";background-image:" + ("-o-linear-gradient(top,#27ac27,#349734)")  + ";background-image:" + ("linear-gradient(top,#27ac27,#349734)")  + ";}.GD-EPHMNJ.GD-EPHMEJ:active{-webkit-box-shadow:" + ("inset"+ " " +"0"+ " " +"1px"+ " " +"2px"+ " " +"rgba(0,0,0,0.3)")  + ";-moz-box-shadow:" + ("inset"+ " " +"0"+ " " +"1px"+ " " +"2px"+ " " +"rgba(0,0,0,0.3)")  + ";box-shadow:" + ("inset"+ " " +"0"+ " " +"1px"+ " " +"2px"+ " " +"rgba(0,0,0,0.3)")  + ";background-color:" + ("#2ab32a")  + ";background-image:" + ("-webkit-linear-gradient(top,#2ab32a,#188118)")  + ";background-image:" + ("-moz-linear-gradient(top,#2ab32a,#188118)")  + ";background-image:" + ("-ms-linear-gradient(top,#2ab32a,#188118)")  + ";background-image:" + ("-o-linear-gradient(top,#2ab32a,#188118)")  + ";background-image:") + (("linear-gradient(top,#2ab32a,#188118)")  + ";border:" + ("1px"+ " " +"solid"+ " " +"#146814")  + ";}.GD-EPHMNJ.GD-EPHMKJ{margin:" + ("0")  + ";}.GD-EPHMPI{-webkit-border-radius:" + ("2px")  + ";-moz-border-radius:" + ("2px")  + ";border-radius:" + ("2px")  + ";background-color:" + ("whiteSmoke")  + ";background-image:" + ("-webkit-linear-gradient(top,whiteSmoke,#f1f1f1)")  + ";background-image:" + ("-moz-linear-gradient(top,whiteSmoke,#f1f1f1)")  + ";background-image:" + ("-ms-linear-gradient(top,whiteSmoke,#f1f1f1)")  + ";background-image:" + ("-o-linear-gradient(top,whiteSmoke,#f1f1f1)") ) + (";background-image:" + ("linear-gradient(top,whiteSmoke,#f1f1f1)")  + ";border:" + ("1px"+ " " +"solid"+ " " +"gainsboro")  + ";border:" + ("1px"+ " " +"solid"+ " " +"rgba(0,0,0,0.1)")  + ";color:" + ("#444")  + ";cursor:" + ("default")  + ";font-size:" + ("13px")  + ";font-weight:" + ("normal")  + ";height:" + ("29px")  + ";line-height:" + ("27px")  + ";margin:" + ("0"+ " " +"0"+ " " +"0"+ " " +"16px")  + ";min-width:") + (("72px")  + ";outline:" + ("0")  + ";padding:" + ("0"+ " " +"8px")  + ";}.GD-EPHMPI:hover{-webkit-box-shadow:" + ("0"+ " " +"1px"+ " " +"1px"+ " " +"rgba(0,0,0,0.1)")  + ";-moz-box-shadow:" + ("0"+ " " +"1px"+ " " +"1px"+ " " +"rgba(0,0,0,0.1)")  + ";box-shadow:" + ("0"+ " " +"1px"+ " " +"1px"+ " " +"rgba(0,0,0,0.1)")  + ";background-color:" + ("#f8f8f8")  + ";background-image:" + ("-webkit-linear-gradient(top,#f8f8f8,#f1f1f1)")  + ";background-image:" + ("-moz-linear-gradient(top,#f8f8f8,#f1f1f1)")  + ";background-image:" + ("-ms-linear-gradient(top,#f8f8f8,#f1f1f1)")  + ";background-image:" + ("-o-linear-gradient(top,#f8f8f8,#f1f1f1)") ) + (";background-image:" + ("linear-gradient(top,#f8f8f8,#f1f1f1)")  + ";border:" + ("1px"+ " " +"solid"+ " " +"#c6c6c6")  + ";color:" + ("#333")  + ";}.GD-EPHMPI:active{-webkit-box-shadow:" + ("0"+ " " +"1px"+ " " +"1px"+ " " +"rgba(0,0,0,0.1)")  + ";-moz-box-shadow:" + ("0"+ " " +"1px"+ " " +"1px"+ " " +"rgba(0,0,0,0.1)")  + ";box-shadow:" + ("0"+ " " +"1px"+ " " +"1px"+ " " +"rgba(0,0,0,0.1)")  + ";background-color:" + ("#f8f8f8")  + ";background-image:" + ("-webkit-linear-gradient(top,#f8f8f8,#f1f1f1)")  + ";background-image:" + ("-moz-linear-gradient(top,#f8f8f8,#f1f1f1)")  + ";background-image:" + ("-ms-linear-gradient(top,#f8f8f8,#f1f1f1)")  + ";background-image:") + (("-o-linear-gradient(top,#f8f8f8,#f1f1f1)")  + ";background-image:" + ("linear-gradient(top,#f8f8f8,#f1f1f1)")  + ";border:" + ("1px"+ " " +"solid"+ " " +"#c6c6c6")  + ";color:" + ("#333")  + ";-webkit-box-shadow:" + ("inset"+ " " +"0"+ " " +"1px"+ " " +"2px"+ " " +"rgba(0,0,0,0.1)")  + ";-moz-box-shadow:" + ("inset"+ " " +"0"+ " " +"1px"+ " " +"2px"+ " " +"rgba(0,0,0,0.1)")  + ";box-shadow:" + ("inset"+ " " +"0"+ " " +"1px"+ " " +"2px"+ " " +"rgba(0,0,0,0.1)")  + ";}.GD-EPHMPI:focus{border:" + ("1px"+ " " +"solid"+ " " +"#4d90fe")  + ";}")) : ((".GD-EPHMFJ{height:" + ((AppResources_default_InlineClientBundleGenerator.this.handlerArrowRight()).getHeight() + "px")  + ";width:" + ((AppResources_default_InlineClientBundleGenerator.this.handlerArrowRight()).getWidth() + "px")  + ";overflow:" + ("hidden")  + ";background:" + ("url(\"" + (AppResources_default_InlineClientBundleGenerator.this.handlerArrowRight()).getSafeUri().asString() + "\") -" + (AppResources_default_InlineClientBundleGenerator.this.handlerArrowRight()).getLeft() + "px -" + (AppResources_default_InlineClientBundleGenerator.this.handlerArrowRight()).getTop() + "px  no-repeat")  + ";background-position:" + ("1px"+ " " +"center")  + ";}.GD-EPHMHJ{height:" + ((AppResources_default_InlineClientBundleGenerator.this.handlerArrowDown()).getHeight() + "px")  + ";width:" + ((AppResources_default_InlineClientBundleGenerator.this.handlerArrowDown()).getWidth() + "px")  + ";overflow:" + ("hidden")  + ";background:" + ("url(\"" + (AppResources_default_InlineClientBundleGenerator.this.handlerArrowDown()).getSafeUri().asString() + "\") -" + (AppResources_default_InlineClientBundleGenerator.this.handlerArrowDown()).getLeft() + "px -" + (AppResources_default_InlineClientBundleGenerator.this.handlerArrowDown()).getTop() + "px  no-repeat")  + ";background-position:" + ("3px"+ " " +"center")  + ";}.GD-EPHMJJ{font-style:") + (("italic")  + ";}.GD-EPHMGJ{width:" + ("15px")  + ";height:" + ("24px")  + ";display:" + ("-webkit-box")  + ";cursor:" + ("pointer")  + ";}.GD-EPHMGJ:hover{background-color:" + ("#eee")  + ";}.GD-EPHMFK{margin-top:" + ("10px")  + ";margin-right:" + ("5px")  + ";}.GD-EPHMFK>.GD-EPHMDK{display:" + ("-webkit-box")  + ";}.GD-EPHMFK>.GD-EPHMDK>.GD-EPHMBK{display:" + ("block")  + ";padding:" + ("4px"+ " " +"18px"+ " " +"3px"+ " " +"18px") ) + (";margin-right:" + ("2px")  + ";border-top-left-radius:" + ("3px"+ " " +"3px")  + ";border-top-right-radius:" + ("3px"+ " " +"3px")  + ";color:" + ("blue")  + ";text-decoration:" + ("none")  + ";cursor:" + ("pointer")  + ";}.GD-EPHMFK .GD-EPHMOJ{display:" + ("-webkit-box")  + ";-webkit-box-pack:" + ("end")  + ";-webkit-box-flex:" + ("1")  + ";font-weight:" + ("bold")  + ";-webkit-box-align:") + (("center")  + ";-webkit-padding-end:" + ("14px")  + ";}.GD-EPHMFK>.GD-EPHMDK>.GD-EPHMBK.GD-EPHMCK{background-color:" + ("#ccc")  + ";color:" + ("black")  + ";}.GD-EPHMFK>.GD-EPHMEK{border:" + ("1px"+ " " +"#ccc"+ " " +"solid")  + ";display:" + ("-webkit-box")  + ";-webkit-box-orient:" + ("horizontal")  + ";min-height:" + ("100px")  + ";}.GD-EPHMFK>.GD-EPHMEK>.GD-EPHMPJ{display:" + ("none")  + ";}.GD-EPHMFK>.GD-EPHMEK>.GD-EPHMPJ.GD-EPHMAK{display:" + ("block")  + ";width:" + ("100%") ) + (";height:" + ("100%")  + ";}.GD-EPHMAJ,.GD-EPHMLJ{margin:" + ("5px"+ " " +"4px"+ " " +"7px"+ " " +"0")  + ";padding:" + ("2px"+ " " +"6px")  + ";border:" + ("1px"+ " " +"#e5e5e5"+ " " +"solid")  + ";cursor:" + ("pointer")  + ";}.GD-EPHMCJ .GD-EPHMLJ{display:" + ("-webkit-inline-box")  + ";}.GD-EPHMAJ:hover,.GD-EPHMLJ:hover{border-color:" + ("#999")  + ";background-color:" + ("#eaeaea")  + ";}.GD-EPHMMJ{-webkit-appearance:" + ("button")  + ";-webkit-border-radius:" + ("2px")  + ";-webkit-box-shadow:") + (("0"+ " " +"1px"+ " " +"3px"+ " " +"rgba(0,0,0,0.1)")  + ";background-image:" + ("url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAICAYAAADJEc7MAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjA5MDMwMzEzMUVBRTExRTA5NUM0QzJENTZCN0I5Mjk1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjA5MDMwMzE0MUVBRTExRTA5NUM0QzJENTZCN0I5Mjk1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDkwMzAzMTExRUFFMTFFMDk1QzRDMkQ1NkI3QjkyOTUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDkwMzAzMTIxRUFFMTFFMDk1QzRDMkQ1NkI3QjkyOTUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5pY8xsAAAAbUlEQVR42mL8//8/AzmAEYijgJgHj5ovQMOXYYgmAgEzM/M3IPM/OgaJg+RBrkLHIEJhwYIFC9nY2H4iawLxQeIgeVwaMTQT0oSsEa6Zj4/vCyFN6BrBmt++fdtESBMIM2KJDlYg/k0oOgACDABJirkKokz/DAAAAABJRU5ErkJggg==), -webkit-linear-gradient(#FAFAFA, #F4F4F4 40%, #E5E5E5)")  + ";background-position:" + ("center"+ " " +"right")  + ";background-repeat:" + ("no-repeat")  + ";border:" + ("1px"+ " " +"solid"+ " " +"#aaa")  + ";color:" + ("#555")  + ";font-size:" + ("inherit")  + ";margin:" + ("0")  + ";overflow:" + ("hidden")  + ";padding:" + ("2px"+ " " +"20px"+ " " +"2px"+ " " +"5px")  + ";text-overflow:" + ("ellipsis") ) + (";white-space:" + ("nowrap")  + ";}.GD-EPHMOI{margin:" + ("7px")  + ";display:" + ("inline-block")  + ";}.GD-EPHMCJ,.GD-EPHMCJ>*{display:" + ("-webkit-box")  + ";}.GD-EPHMDJ{-webkit-box-flex:" + ("1")  + ";}.GD-EPHMIJ{display:" + ("none")  + " !important;}.GD-EPHMNJ{background-color:" + ("#d14836")  + ";background-image:" + ("-webkit-linear-gradient(top,#dd4b39,#d14836)")  + ";background-image:" + ("-moz-linear-gradient(top,#dd4b39,#d14836)")  + ";background-image:" + ("-ms-linear-gradient(top,#dd4b39,#d14836)")  + ";background-image:") + (("-o-linear-gradient(top,#dd4b39,#d14836)")  + ";background-image:" + ("linear-gradient(top,#dd4b39,#d14836)")  + ";border:" + ("1px"+ " " +"solid"+ " " +"transparent")  + ";color:" + ("white")  + ";text-shadow:" + ("0"+ " " +"1px"+ " " +"rgba(0,0,0,0.1)")  + ";text-transform:" + ("uppercase")  + ";text-shadow:" + ("0"+ " " +"1px"+ " " +"rgba(0,0,0,0.1)")  + ";padding:" + ("7px"+ " " +"20px")  + ";margin:" + ("15px"+ " " +"7px")  + ";}.GD-EPHMNJ:hover{-moz-box-shadow:" + ("0"+ " " +"1px"+ " " +"1px"+ " " +"rgba(0,0,0,0.2)")  + ";-webkit-box-shadow:" + ("0"+ " " +"1px"+ " " +"1px"+ " " +"rgba(0,0,0,0.2)") ) + (";-ms-box-shadow:" + ("0"+ " " +"1px"+ " " +"1px"+ " " +"rgba(0,0,0,0.2)")  + ";box-shadow:" + ("0"+ " " +"1px"+ " " +"1px"+ " " +"rgba(0,0,0,0.2)")  + ";}.GD-EPHMNJ:active{-webkit-box-shadow:" + ("inset"+ " " +"0"+ " " +"1px"+ " " +"2px"+ " " +"rgba(0,0,0,0.3)")  + ";-moz-box-shadow:" + ("inset"+ " " +"0"+ " " +"1px"+ " " +"2px"+ " " +"rgba(0,0,0,0.3)")  + ";box-shadow:" + ("inset"+ " " +"0"+ " " +"1px"+ " " +"2px"+ " " +"rgba(0,0,0,0.3)")  + ";background-color:" + ("#b0281a")  + ";background-image:" + ("-webkit-linear-gradient(top,#dd4b39,#b0281a)")  + ";background-image:" + ("-moz-linear-gradient(top,#dd4b39,#b0281a)")  + ";background-image:" + ("-ms-linear-gradient(top,#dd4b39,#b0281a)")  + ";background-image:" + ("-o-linear-gradient(top,#dd4b39,#b0281a)")  + ";background-image:") + (("linear-gradient(top,#dd4b39,#b0281a)")  + ";border:" + ("1px"+ " " +"solid"+ " " +"#992a1b")  + ";}.GD-EPHMNJ:FOCUS{border:" + ("1px"+ " " +"solid"+ " " +"transparent")  + ";outline:" + ("0"+ " " +"transparent")  + ";-webkit-box-shadow:" + ("inset"+ " " +"0"+ " " +"0"+ " " +"0"+ " " +"1px"+ " " +"white")  + ";-moz-box-shadow:" + ("inset"+ " " +"0"+ " " +"0"+ " " +"0"+ " " +"1px"+ " " +"#fff")  + ";box-shadow:" + ("inset"+ " " +"0"+ " " +"0"+ " " +"0"+ " " +"1px"+ " " +"white")  + ";}.GD-EPHMNJ.GD-EPHMEJ{background-color:" + ("#27ac27")  + ";background-image:" + ("-webkit-linear-gradient(top,#27ac27,#349734)")  + ";background-image:" + ("-moz-linear-gradient(top,#27ac27,#349734)")  + ";background-image:" + ("-ms-linear-gradient(top,#27ac27,#349734)") ) + (";background-image:" + ("-o-linear-gradient(top,#27ac27,#349734)")  + ";background-image:" + ("linear-gradient(top,#27ac27,#349734)")  + ";}.GD-EPHMNJ.GD-EPHMEJ:active{-webkit-box-shadow:" + ("inset"+ " " +"0"+ " " +"1px"+ " " +"2px"+ " " +"rgba(0,0,0,0.3)")  + ";-moz-box-shadow:" + ("inset"+ " " +"0"+ " " +"1px"+ " " +"2px"+ " " +"rgba(0,0,0,0.3)")  + ";box-shadow:" + ("inset"+ " " +"0"+ " " +"1px"+ " " +"2px"+ " " +"rgba(0,0,0,0.3)")  + ";background-color:" + ("#2ab32a")  + ";background-image:" + ("-webkit-linear-gradient(top,#2ab32a,#188118)")  + ";background-image:" + ("-moz-linear-gradient(top,#2ab32a,#188118)")  + ";background-image:" + ("-ms-linear-gradient(top,#2ab32a,#188118)")  + ";background-image:" + ("-o-linear-gradient(top,#2ab32a,#188118)")  + ";background-image:") + (("linear-gradient(top,#2ab32a,#188118)")  + ";border:" + ("1px"+ " " +"solid"+ " " +"#146814")  + ";}.GD-EPHMNJ.GD-EPHMKJ{margin:" + ("0")  + ";}.GD-EPHMPI{-webkit-border-radius:" + ("2px")  + ";-moz-border-radius:" + ("2px")  + ";border-radius:" + ("2px")  + ";background-color:" + ("whiteSmoke")  + ";background-image:" + ("-webkit-linear-gradient(top,whiteSmoke,#f1f1f1)")  + ";background-image:" + ("-moz-linear-gradient(top,whiteSmoke,#f1f1f1)")  + ";background-image:" + ("-ms-linear-gradient(top,whiteSmoke,#f1f1f1)")  + ";background-image:" + ("-o-linear-gradient(top,whiteSmoke,#f1f1f1)") ) + (";background-image:" + ("linear-gradient(top,whiteSmoke,#f1f1f1)")  + ";border:" + ("1px"+ " " +"solid"+ " " +"gainsboro")  + ";border:" + ("1px"+ " " +"solid"+ " " +"rgba(0,0,0,0.1)")  + ";color:" + ("#444")  + ";cursor:" + ("default")  + ";font-size:" + ("13px")  + ";font-weight:" + ("normal")  + ";height:" + ("29px")  + ";line-height:" + ("27px")  + ";margin:" + ("0"+ " " +"16px"+ " " +"0"+ " " +"0")  + ";min-width:") + (("72px")  + ";outline:" + ("0")  + ";padding:" + ("0"+ " " +"8px")  + ";}.GD-EPHMPI:hover{-webkit-box-shadow:" + ("0"+ " " +"1px"+ " " +"1px"+ " " +"rgba(0,0,0,0.1)")  + ";-moz-box-shadow:" + ("0"+ " " +"1px"+ " " +"1px"+ " " +"rgba(0,0,0,0.1)")  + ";box-shadow:" + ("0"+ " " +"1px"+ " " +"1px"+ " " +"rgba(0,0,0,0.1)")  + ";background-color:" + ("#f8f8f8")  + ";background-image:" + ("-webkit-linear-gradient(top,#f8f8f8,#f1f1f1)")  + ";background-image:" + ("-moz-linear-gradient(top,#f8f8f8,#f1f1f1)")  + ";background-image:" + ("-ms-linear-gradient(top,#f8f8f8,#f1f1f1)")  + ";background-image:" + ("-o-linear-gradient(top,#f8f8f8,#f1f1f1)") ) + (";background-image:" + ("linear-gradient(top,#f8f8f8,#f1f1f1)")  + ";border:" + ("1px"+ " " +"solid"+ " " +"#c6c6c6")  + ";color:" + ("#333")  + ";}.GD-EPHMPI:active{-webkit-box-shadow:" + ("0"+ " " +"1px"+ " " +"1px"+ " " +"rgba(0,0,0,0.1)")  + ";-moz-box-shadow:" + ("0"+ " " +"1px"+ " " +"1px"+ " " +"rgba(0,0,0,0.1)")  + ";box-shadow:" + ("0"+ " " +"1px"+ " " +"1px"+ " " +"rgba(0,0,0,0.1)")  + ";background-color:" + ("#f8f8f8")  + ";background-image:" + ("-webkit-linear-gradient(top,#f8f8f8,#f1f1f1)")  + ";background-image:" + ("-moz-linear-gradient(top,#f8f8f8,#f1f1f1)")  + ";background-image:" + ("-ms-linear-gradient(top,#f8f8f8,#f1f1f1)")  + ";background-image:") + (("-o-linear-gradient(top,#f8f8f8,#f1f1f1)")  + ";background-image:" + ("linear-gradient(top,#f8f8f8,#f1f1f1)")  + ";border:" + ("1px"+ " " +"solid"+ " " +"#c6c6c6")  + ";color:" + ("#333")  + ";-webkit-box-shadow:" + ("inset"+ " " +"0"+ " " +"1px"+ " " +"2px"+ " " +"rgba(0,0,0,0.1)")  + ";-moz-box-shadow:" + ("inset"+ " " +"0"+ " " +"1px"+ " " +"2px"+ " " +"rgba(0,0,0,0.1)")  + ";box-shadow:" + ("inset"+ " " +"0"+ " " +"1px"+ " " +"2px"+ " " +"rgba(0,0,0,0.1)")  + ";}.GD-EPHMPI:focus{border:" + ("1px"+ " " +"solid"+ " " +"#4d90fe")  + ";}"));
      }
      public java.lang.String addValueAnchor(){
        return "GD-EPHMOI";
      }
      public java.lang.String button(){
        return "GD-EPHMPI";
      }
      public java.lang.String formCtrl(){
        return "GD-EPHMAJ";
      }
      public java.lang.String formKeyInput(){
        return "GD-EPHMBJ";
      }
      public java.lang.String formRow(){
        return "GD-EPHMCJ";
      }
      public java.lang.String formValueInput(){
        return "GD-EPHMDJ";
      }
      public java.lang.String green(){
        return "GD-EPHMEJ";
      }
      public java.lang.String handlerImageClosed(){
        return "GD-EPHMFJ";
      }
      public java.lang.String handlerImageContainer(){
        return "GD-EPHMGJ";
      }
      public java.lang.String handlerImageOpened(){
        return "GD-EPHMHJ";
      }
      public java.lang.String hidden(){
        return "GD-EPHMIJ";
      }
      public java.lang.String inlineNote(){
        return "GD-EPHMJJ";
      }
      public java.lang.String nomargin(){
        return "GD-EPHMKJ";
      }
      public java.lang.String removeButton(){
        return "GD-EPHMLJ";
      }
      public java.lang.String selectControl(){
        return "GD-EPHMMJ";
      }
      public java.lang.String submit(){
        return "GD-EPHMNJ";
      }
      public java.lang.String tabCaption(){
        return "GD-EPHMOJ";
      }
      public java.lang.String tabContent(){
        return "GD-EPHMPJ";
      }
      public java.lang.String tabContentCurrent(){
        return "GD-EPHMAK";
      }
      public java.lang.String tabHadler(){
        return "GD-EPHMBK";
      }
      public java.lang.String tabHandlercurrent(){
        return "GD-EPHMCK";
      }
      public java.lang.String tabs(){
        return "GD-EPHMDK";
      }
      public java.lang.String tabsContent(){
        return "GD-EPHMEK";
      }
      public java.lang.String tabsPanel(){
        return "GD-EPHMFK";
      }
    }
    ;
  }
  private static class appCssInitializer {
    static {
      _instance0.appCssInitializer();
    }
    static org.rest.client.resources.AppCssResource get() {
      return appCss;
    }
  }
  public org.rest.client.resources.AppCssResource appCss() {
    return appCssInitializer.get();
  }
  private void handlerArrowDownInitializer() {
    handlerArrowDown = new com.google.gwt.resources.client.impl.ImageResourcePrototype(
      "handlerArrowDown",
      com.google.gwt.safehtml.shared.UriUtils.fromTrustedString(externalImage),
      0, 0, 9, 6, false, false
    );
  }
  private static class handlerArrowDownInitializer {
    static {
      _instance0.handlerArrowDownInitializer();
    }
    static com.google.gwt.resources.client.ImageResource get() {
      return handlerArrowDown;
    }
  }
  public com.google.gwt.resources.client.ImageResource handlerArrowDown() {
    return handlerArrowDownInitializer.get();
  }
  private void handlerArrowRightInitializer() {
    handlerArrowRight = new com.google.gwt.resources.client.impl.ImageResourcePrototype(
      "handlerArrowRight",
      com.google.gwt.safehtml.shared.UriUtils.fromTrustedString(externalImage0),
      0, 0, 9, 11, false, false
    );
  }
  private static class handlerArrowRightInitializer {
    static {
      _instance0.handlerArrowRightInitializer();
    }
    static com.google.gwt.resources.client.ImageResource get() {
      return handlerArrowRight;
    }
  }
  public com.google.gwt.resources.client.ImageResource handlerArrowRight() {
    return handlerArrowRightInitializer.get();
  }
  private static java.util.HashMap<java.lang.String, com.google.gwt.resources.client.ResourcePrototype> resourceMap;
  private static org.rest.client.resources.AppCssResource appCss;
  private static final java.lang.String externalImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAYAAAARx7TFAAAAIUlEQVR42mNIS0v7TwgzEKUIBAgqgAGCCrApZMAHsCkAALOeSoMc1hLNAAAAAElFTkSuQmCC";
  private static final java.lang.String externalImage0 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAALCAYAAACtWacbAAAAK0lEQVR42mNgIAXMnDnzPwgTpQivQmRFOBWiK8KqEJsiDIVkmUS57xjIBQDkOF7VVCaFowAAAABJRU5ErkJggg==";
  private static com.google.gwt.resources.client.ImageResource handlerArrowDown;
  private static com.google.gwt.resources.client.ImageResource handlerArrowRight;
  
  public ResourcePrototype[] getResources() {
    return new ResourcePrototype[] {
      appCss(), 
      handlerArrowDown(), 
      handlerArrowRight(), 
    };
  }
  public ResourcePrototype getResource(String name) {
    if (GWT.isScript()) {
      return getResourceNative(name);
    } else {
      if (resourceMap == null) {
        resourceMap = new java.util.HashMap<java.lang.String, com.google.gwt.resources.client.ResourcePrototype>();
        resourceMap.put("appCss", appCss());
        resourceMap.put("handlerArrowDown", handlerArrowDown());
        resourceMap.put("handlerArrowRight", handlerArrowRight());
      }
      return resourceMap.get(name);
    }
  }
  private native ResourcePrototype getResourceNative(String name) /*-{
    switch (name) {
      case 'appCss': return this.@org.rest.client.resources.AppResources::appCss()();
      case 'handlerArrowDown': return this.@org.rest.client.resources.AppResources::handlerArrowDown()();
      case 'handlerArrowRight': return this.@org.rest.client.resources.AppResources::handlerArrowRight()();
    }
    return null;
  }-*/;
}
