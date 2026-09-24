// Interaction-state captures for interactive @grafana/ui stories.
// Each (story, state) pair loads the story fresh, drives one interaction, then shoots.
//
//   sel      element inside #storybook-root the interaction targets (first match)
//   hoverSel override for hover/active (e.g. the visible <label> of a hidden checkbox)
//   states   subset of: hover | focus | active | disabled | open
//            focus    = keyboard modality (Tab) + element.focus() -> :focus-visible
//            active   = mouse button held down on the element while shooting
//            disabled = story reloaded with `args=disabled:!true`
//            open     = click to open (menus, pickers, popovers, toggletips)
//   openWait selector (anywhere in the document) that must be visible after `open`

export const stateTargets = [
  { story: 'inputs-button--basic', sel: 'button', states: ['hover', 'focus', 'active', 'disabled'] },
  { story: 'inputs-iconbutton--basic', sel: 'button', states: ['hover', 'focus', 'active', 'disabled'] },
  { story: 'navigation-toolbarbutton--basic-with-text', sel: 'button', states: ['hover', 'focus', 'active', 'disabled'] },
  { story: 'inputs-clipboardbutton--clipboard-button', sel: 'button', states: ['hover', 'focus', 'active'] },
  { story: 'inputs-filterpill--basic', sel: 'button', states: ['hover', 'focus', 'active'] },
  { story: 'foundations-textlink--standalone', sel: 'a', states: ['hover', 'focus', 'active'] },
  { story: 'navigation-tabs--simple', sel: '[role="tab"]:not([aria-selected="true"])', states: ['hover', 'focus', 'active'] },
  { story: 'navigation-pagination--with-pages', sel: 'button', states: ['hover', 'focus'] },
  { story: 'layout-card--as-a-link', sel: 'a', states: ['hover', 'focus'] },
  { story: 'layout-card--as-a-button', sel: 'button', states: ['hover', 'focus', 'active'] },
  { story: 'inputs-input--simple', sel: 'input', states: ['hover', 'focus', 'disabled'] },
  { story: 'inputs-textarea--basic', sel: 'textarea', states: ['hover', 'focus', 'disabled'] },
  { story: 'inputs-secretinput--basic', sel: 'input', states: ['hover', 'focus'] },
  { story: 'inputs-tagsinput--basic', sel: 'input', states: ['hover', 'focus', 'disabled'] },
  { story: 'inputs-checkbox--basic', sel: 'input[type="checkbox"]', hoverSel: 'label', states: ['hover', 'focus', 'active', 'disabled'] },
  { story: 'inputs-switch--controlled', sel: 'input', hoverSel: 'label', states: ['hover', 'focus', 'disabled'] },
  { story: 'inputs-radiobuttongroup--radio-buttons', sel: 'input[type="radio"]:not(:checked)', hoverSel: 'input[type="radio"]:not(:checked) + label', states: ['hover', 'focus', 'disabled'] },
  { story: 'inputs-radiobuttonlist--default', sel: 'input[type="radio"]', hoverSel: 'label', states: ['hover', 'focus', 'disabled'] },
  { story: 'inputs-slider--basic', sel: '[role="slider"]', states: ['hover', 'focus', 'disabled'] },
  { story: 'inputs-confirmbutton--basic', sel: 'button', states: ['hover', 'focus', 'open', 'disabled'] },
  { story: 'layout-collapse--basic', sel: 'button', states: ['hover', 'focus', 'open'] },
  { story: 'layout-collapsablesection--basic', sel: 'button', states: ['hover', 'focus', 'open'] },
  { story: 'inputs-combobox--basic', sel: 'input', states: ['hover', 'focus', 'open', 'disabled'], openWait: '[role="listbox"]' },
  { story: 'inputs-multicombobox--basic', sel: 'input', states: ['hover', 'focus', 'open', 'disabled'], openWait: '[role="listbox"]' },
  { story: 'inputs-deprecated-select--basic', sel: 'input', states: ['hover', 'focus', 'open', 'disabled'], openWait: '[aria-label="Select options menu"], [role="listbox"]' },
  { story: 'inputs-deprecated-select--multi-select-basic', sel: 'input', states: ['open'], openWait: '[aria-label="Select options menu"], [role="listbox"]' },
  { story: 'inputs-segment--basic', sel: 'button, [role="button"], a', states: ['hover', 'open'] },
  { story: 'inputs-buttoncascader--simple', sel: 'button', states: ['hover', 'focus', 'open', 'disabled'] },
  { story: 'inputs-cascader--simple', sel: 'input', states: ['focus', 'open'] },
  { story: 'overlays-dropdown--examples', sel: 'button', states: ['hover', 'focus', 'open'], openWait: '[role="menu"]' },
  { story: 'overlays-menu--examples', sel: '[role="menuitem"]', states: ['hover', 'focus'] },
  { story: 'overlays-tooltip--basic', sel: 'button', states: ['hover', 'focus'] },
  { story: 'overlays-toggletip--basic', sel: 'button', states: ['hover', 'focus', 'open'], openWait: 'text=Title of the Toggletip' },
  { story: 'pickers-colorpicker--basic', sel: 'button, [role="button"], div[style*="background"]', states: ['hover', 'open'] },
  { story: 'pickers-unitpicker--basic', sel: 'input, button', states: ['open'] },
  { story: 'pickers-valuepicker--simple', sel: 'button', states: ['hover', 'focus', 'open'] },
  { story: 'pickers-statspicker--picker', sel: 'input', states: ['open'] },
  { story: 'pickers-refreshpicker--examples', sel: 'button', states: ['hover', 'focus', 'open'] },
  { story: 'inputs-deprecated-buttonselect--basic', sel: 'button', states: ['hover', 'focus', 'open'] },
  { story: 'date-time-pickers-timerangepicker--basic', sel: 'button', states: ['hover', 'focus', 'open'] },
  { story: 'date-time-pickers-timerangeinput--basic', sel: 'button, input', states: ['hover', 'focus', 'open', 'disabled'] },
  { story: 'date-time-pickers-datetimepicker--basic', sel: 'input', states: ['hover', 'focus', 'open', 'disabled'] },
  { story: 'date-time-pickers-datepickerwithinput--basic', sel: 'input', states: ['hover', 'focus', 'open', 'disabled'] },
  { story: 'date-time-pickers-timezonepicker--basic', sel: 'input', states: ['hover', 'focus', 'open', 'disabled'] },
  { story: 'date-time-pickers-timeofdaypicker--basic', sel: 'input', states: ['hover', 'focus', 'open', 'disabled'] },
  { story: 'plugins-panelchrome--examples-hover-header', sel: 'section, [data-testid*="Panel header"]', states: ['hover'] },
];
