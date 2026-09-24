// @ts-check
const emotionPlugin = require('@emotion/eslint-plugin');
const stylexPlugin = require('@stylexjs/eslint-plugin');
const restrictedGlobals = require('confusing-browser-globals');
const importPlugin = require('eslint-plugin-import');
const jestPlugin = require('eslint-plugin-jest');
const jestDomPlugin = require('eslint-plugin-jest-dom');
const jsxA11yPlugin = require('eslint-plugin-jsx-a11y');
const lodashPlugin = require('eslint-plugin-lodash');
const barrelPlugin = require('eslint-plugin-no-barrel-files');
const reactPlugin = require('eslint-plugin-react');
const reactPreferFunctionComponentPlugin = require('eslint-plugin-react-prefer-function-component');
const testingLibraryPlugin = require('eslint-plugin-testing-library');
const unicornPlugin = require('eslint-plugin-unicorn');

const grafanaConfig = require('@grafana/eslint-config/flat');
const grafanaPlugin = require('@grafana/eslint-plugin');
const grafanaI18nPlugin = require('@grafana/i18n/eslint-plugin');

const pluginsToTranslate = [
  'public/app/plugins/panel',
  'public/app/plugins/datasource/azuremonitor',
  'public/app/plugins/datasource/mssql',
];

const commonTestIgnores = [
  '**/*.{test,spec}.{ts,tsx}',
  '**/__mocks__/**',
  '**/mocks/**/*.{ts,tsx}',
  '**/public/test/**',
  '**/{mocks,test-utils}.{ts,tsx}',
  '**/*.mock.{ts,tsx}',
  '**/{test-helpers,testHelpers}.{ts,tsx}',
  '**/{spec,test-helpers}/**/*.{ts,tsx}',
  'packages/grafana-test-utils/src/**/*.{ts,tsx}',
];

const generatedFiles = ['**/*.gen.ts', '**/*_gen.ts'];

const enterpriseIgnores = ['public/app/extensions/**/*', 'e2e/extensions/**/*'];

// [FIXME] add comment about this applying everywhere
const baseImportConfig = {
  patterns: [
    {
      group: ['react-i18next', 'i18next'],
      importNames: ['t'],
      message: 'Please import from @grafana/i18n instead',
    },
    {
      group: ['react-i18next'],
      importNames: ['Trans'],
      message: 'Please import from @grafana/i18n instead',
    },
    {
      group: ['@grafana/ui*', '*/Layout/*'],
      importNames: ['Layout', 'HorizontalGroup', 'VerticalGroup'],
      message: 'Use Stack component instead.',
    },
    {
      regex: '\\.test$',
      message:
        'Do not import test files. If you require reuse of constants/mocks across files, create a separate file with no tests',
    },
    {
      group: ['@grafana/ui/src/*', '@grafana/runtime/src/*', '@grafana/data/src/*'],
      message: 'Import from the public export instead.',
    },
  ],
  paths: [
    {
      name: 'react-redux',
      importNames: ['useDispatch', 'useSelector'],
      message: 'Please import from app/types/store instead.',
    },
  ],
};

/**
 *
 * @param {{ patterns?: Array<object>, paths?: Array<object> }} config
 * @returns
 */
function withBaseRestrictedImportsConfig(config = {}) {
  const finalConfig = {
    patterns: [...baseImportConfig.patterns, ...(config?.patterns ?? [])],
    paths: [...baseImportConfig.paths, ...(config?.paths ?? [])],
  };
  return finalConfig;
}

const datavizDefaultImportsRestrictions = [
  {
    group: ['@emotion/css'],
    importNames: ['cx'],
    message: 'Do not use "cx" from @emotion/css. Instead, use `clsx` and compose together only strings.',
  },
];

// Files migrated to StyleX. Emotion and the Emotion-era style hooks are banned in them. Each migration
// slice appends its files or directories here (see the StyleX conventions doc).
const stylexMigratedUiFiles = [
  'packages/grafana-ui/src/themes/stylex/**/*.{ts,tsx}',
  // U1 primitives
  'packages/grafana-ui/src/components/{Badge,Button,Divider,Icon,IconButton,Layout,Link,LoadingPlaceholder,Spinner,Text}/**/*.{ts,tsx}',
  // U6 data
  'packages/grafana-ui/src/components/{CallToActionCard,Card,EmptyState,InteractiveTable,JSONFormatter,List,Pagination}/**/*.{ts,tsx}',
  'packages/grafana-ui/src/components/Table/**/*.{ts,tsx}',
  // U3 pickers
  'packages/grafana-ui/src/components/{Cascader,Combobox,MatchersUI,Segment,Select,StatsPicker,Tags,TagsInput,UnitPicker,ValuePicker}/**/*.{ts,tsx}',
  // U5 time
  'packages/grafana-ui/src/components/{DateTimePickers,RefreshPicker}/**/*.{ts,tsx}',
  // U7 viz
  'packages/grafana-ui/src/components/{PanelChrome,RadialGauge,Sparkline,uPlot,VizLayout,VizLegend,VizTooltip}/**/*.{ts,tsx}',
  // U8 chrome/globals
  'packages/grafana-ui/src/themes/GlobalStyles/**/*.{ts,tsx}',
  'packages/grafana-ui/src/utils/skeleton.tsx',
  // U8 chrome
  'packages/grafana-ui/src/components/{CustomScrollbar,DragHandle,Monaco,PageLayout,QueryField,ScrollContainer,Sidebar,Splitter,TabbedContainer,Tabs,Typeahead}/**/*.{ts,tsx}',
  // U2 inputs
  'packages/grafana-ui/src/components/{FileUpload,FilterInput,FormField,FormLabel,Forms,Input,SecretFormField,SecretInput,SecretTextArea,Switch,TextArea}/**/*.{ts,tsx}',
];

// public/app files migrated to StyleX: same bans as stylexMigratedUiFiles. Each app slice appends its directories.
const stylexMigratedAppFiles = [
  // E1 explore
  'public/app/features/explore/TraceView/**/*.{ts,tsx}',
  'public/app/features/explore/**/*.{ts,tsx}',
  // C1 core: app chrome and page frame
  'public/app/core/components/AppChrome/{AppChrome,AppChromeMenu}.tsx',
  'public/app/core/components/AppChrome/ExtensionSidebar/ExtensionSidebar.tsx',
  'public/app/core/components/AppChrome/MegaMenu/*.{ts,tsx}',
  'public/app/core/components/AppChrome/OrganizationSwitcher/OrganizationSelect.tsx',
  'public/app/core/components/AppChrome/{NavToolbar,News,ReturnToPrevious}/*.{ts,tsx}',
  'public/app/core/components/AppChrome/TopBar/{SignInLink,SingleTopBar,SingleTopBarActions,TopNavBarMenu}.tsx',
  'public/app/core/components/{Breadcrumbs,Footer,Indent,PageInfo,PageNotFound}/*.{ts,tsx}',
  'public/app/core/components/NavLandingPage/NavLandingPage.tsx',
  'public/app/core/components/Page/{Page,PageHeader,PageTabs}.tsx',
  'public/app/core/navigation/*.{ts,tsx}',
  // P1 core-bundled panels
  'public/app/plugins/panel/{alertlist,annolist,dashlist,gauge,gettingstarted,heatmap,live,logs,logstable,news,piechart,state-timeline,status-history,table,text,traces,welcome,xychart}/**/*.{ts,tsx}',
  'public/app/plugins/panel/{nodeGraph,timeseries}/**/*.{ts,tsx}',
  'public/app/plugins/panel/{canvas,geomap}/**/*.{ts,tsx}',
  // D3 dashboard
  'public/app/features/dashboard/components/{AddLibraryPanelWidget,AnnotationSettings,DashboardLoading,DashboardRow,DashboardSettings,DashNav,DeleteDashboard,GenAI,HelpWizard,PanelEditor,RowOptions}/**/*.{ts,tsx}',
  // D2 dashboard-scene (panel-edit/ and edit-pane/ belong to D1)
  'public/app/features/dashboard-scene/scene/**/*.{ts,tsx}',
  // D2 dashboard-scene: remaining directories
  'public/app/features/dashboard-scene/{assistant,components,conditional-rendering,embedding,inspect,pages,saving,sharing,solo,utils,v2schema}/**/*.{ts,tsx}',
  // M2 admin and misc features
  'public/app/features/{auth-config,gops,invites,migrate-to-cloud,notifications,profile,teams,theme-playground}/**/*.{ts,tsx}',
  'public/app/features/admin/{AdminOrgsTable,EnterpriseAuthFeaturesCard,LicenseChrome,ServerStats,ServerStatsCard,UpgradePage,UserListAdminPage,UserListAnonymousPage,UserListPage,UserPermissions,UserProfile}.tsx',
  'public/app/features/admin/ldap/LdapSettingsPage.tsx',
  'public/app/features/serviceaccounts/ServiceAccountsListPage.tsx',
  'public/app/features/serviceaccounts/components/{ServiceAccountProfile,ServiceAccountProfileRow,ServiceAccountTokensTable,ServiceAccountsListItem}.tsx',
  // A2 alerting: everything except unified/components (A1) and unified/styles (helpers still consumed by A1)
  'public/app/features/alerting/*.{ts,tsx}',
  'public/app/features/alerting/state/**/*.{ts,tsx}',
  'public/app/features/alerting/unified/*.{ts,tsx}',
  'public/app/features/alerting/unified/!(components|styles)/**/*.{ts,tsx}',
  // M1 plugins, provisioning
  'public/app/features/plugins/**/*.{ts,tsx}',
  'public/app/features/provisioning/**/*.{ts,tsx}',
  'public/app/features/connections/tabs/ConnectData/CardGrid/*.{ts,tsx}',
  // P2 core-bundled datasource plugins
  'public/app/plugins/datasource/{alertmanager,cloudwatch,dashboard,grafana,influxdb,mixed,prometheus}/**/*.{ts,tsx}',
  // A1 alerting components
  'public/app/features/alerting/unified/components/*.{ts,tsx}',
  'public/app/features/alerting/unified/components/{common,rules,rule-viewer}/**/*.{ts,tsx}',
  // M2b browse/manage dashboards, search, command palette, playlist, bookmarks, annotations
  'public/app/features/{annotations,bookmarks,commandPalette,playlist}/**/*.{ts,tsx}',
  'public/app/features/browse-dashboards/{BrowseDashboardsPage,RecentlyDeletedPage}.tsx',
  'public/app/features/browse-dashboards/components/{CheckboxCell,DashboardsTree,NameCell,TagsCell}.tsx',
  'public/app/features/browse-dashboards/components/FolderDetailsActions/FolderDetailsActions.tsx',
  'public/app/features/manage-dashboards/components/SnapshotListTableRow.tsx',
  'public/app/features/manage-dashboards/components/PublicDashboardListTable/{DeletePublicDashboardModal,PublicDashboardListTable}.tsx',
  'public/app/features/manage-dashboards/import/components/LibraryPanelsList.tsx',
  'public/app/features/search/page/components/{ActionRow,OwnersFilter,SearchResultsTable,columns}.tsx',
  // D2 dashboard-scene settings
  'public/app/features/dashboard-scene/settings/**/*.{ts,tsx}',
  // C1 core: forms, login, folder picker, preferences, theme selector
  'public/app/core/components/{AccessControl,ForgottenPassword,Form,RolePickerDrawer,SharedPreferences,Theme,ThemeSelector}/*.{ts,tsx}',
  'public/app/core/components/Branding/{Branding,OrangeBadge}.tsx',
  'public/app/core/components/Login/{LoginForm,LoginPage,UserSignup}.tsx',
  'public/app/core/components/NestedFolderPicker/NestedFolderList.tsx',
  'public/app/core/components/Upgrade/ProBadge.tsx',
  // M3 features long tail
  'public/app/features/{actions,canvas,dimensions,geo,visualization}/**/*.{ts,tsx}',
  // D1 dashboard-scene panel edit and edit pane
  'public/app/features/dashboard-scene/edit-pane/**/*.{ts,tsx}',
  'public/app/features/dashboard-scene/panel-edit/*.{ts,tsx}',
  'public/app/features/dashboard-scene/panel-edit/{PanelDataPane,splitter,testfiles}/**/*.{ts,tsx}',
  'public/app/features/alerting/unified/components/{rule-editor,expressions,backtesting,create-folder,export,saved-searches}/**/*.{ts,tsx}',
  'public/app/features/alerting/unified/components/notification-policies/{formStyles.ts,EditDefaultPolicyForm.tsx,EditNotificationPolicyForm.tsx}',
  // L1 logs (LogLineContext and LogRowContextModal keep pending Emotion Modal overrides)
  'public/app/features/logs/*.{ts,tsx}',
  'public/app/features/logs/components/*.{ts,tsx}',
  'public/app/features/logs/components/{fieldSelector,mocks,otel}/**/*.{ts,tsx}',
  'public/app/features/logs/components/log-context/!(LogRowContextModal).{ts,tsx}',
  'public/app/features/logs/components/panel/!(LogLineContext).{ts,tsx}',
  'public/app/features/logs/components/panel/{__mocks__,panelState}/**/*.{ts,tsx}',
  'public/app/features/dashboard-scene/{edit-pane,panel-edit}/**/*.{ts,tsx}',
  // D3 dashboard (part 2)
  'public/app/features/dashboard/components/{PublicDashboard,PublicDashboardNotAvailable,SaveDashboard,ShareModal,SubMenu,TransformationsEditor,VersionHistory}/**/*.{ts,tsx}',
  'public/app/features/dashboard/{containers,dashgrid}/**/*.{ts,tsx}',
  'public/app/features/{expressions,scopes,transformers,variables}/**/*.{ts,tsx}',
];

// Files inside a migrated directory that are still Emotion, each with a reason. Remove an entry once migrated.
/** @type {string[]} */
const stylexNotMigratedAppFiles = [];

const stylexRestrictedImports = {
  patterns: [
    {
      group: ['@emotion/*'],
      message: 'This file is migrated to StyleX. Use stylex.create / stylex.props instead of Emotion.',
    },
    {
      group: ['**/themes/ThemeContext', '**/themes/stylesFactory', '**/themes/mixins', '**/compat/emotion/*'],
      importNames: [
        'useStyles2',
        'useStyles',
        'withTheme2',
        'withTheme',
        'stylesFactory',
        'getFocusStyles',
        'getMouseFocusStyles',
      ],
      message: 'This file is migrated to StyleX. Emotion-era style helpers are not allowed.',
    },
  ],
  paths: [
    {
      name: '@grafana/ui',
      importNames: ['useStyles2', 'useStyles', 'stylesFactory', 'withTheme2', 'withTheme'],
      message: 'This file is migrated to StyleX. Emotion-era style hooks are not allowed.',
    },
  ],
};

/**
 * @type {Array<import('eslint').Linter.Config>}
 */
module.exports = [
  {
    name: 'grafana/ignores',
    ignores: [
      '.github',
      '.yarn',
      '**/.*', // dotfiles aren't ignored by default in FlatConfig
      ...generatedFiles,
      '**/build/',
      '**/compiled/',
      '**/dist/',
      'coverage/',
      'data/',
      'deployment_tools_config.json',
      'devenv',
      'e2e-playwright/test-plugins',
      'e2e/tmp',
      'packages/grafana-ui/src/components/Icon/iconBundle.ts',
      'pkg',
      'playwright-report',
      'public/lib/monaco/', // this path is no longer required but local dev environments may still have it
      'public/locales/_build',
      'public/locales/**/*.js',
      'public/vendor/',
      'scripts/grafana-server/tmp',
      'packages/grafana-ui/src/graveyard', // deprecated UI components slated for removal
      'public/build-swagger', // swagger build output
      'apps/plugins/plugin/src/generated/meta/v0alpha1',
      'apps/plugins/plugin/src/generated/plugin/v0alpha1',
    ],
  },
  ...grafanaConfig,
  {
    name: 'react/jsx-runtime-rules',
    rules: reactPlugin.configs.flat['jsx-runtime'].rules,
  },
  {
    name: 'grafana/defaults',
    linterOptions: {
      // This reports unused disable directives that we can clean up but
      // it also conflicts with the betterer eslint rules so disabled
      reportUnusedDisableDirectives: false,
    },
    files: ['**/*.{ts,tsx,js}'],
    ignores: ['packages/grafana-ui/src/components/Forms/Legacy/**'],
    plugins: {
      '@emotion': emotionPlugin,
      lodash: lodashPlugin,
      jest: jestPlugin,
      import: importPlugin,
      'jsx-a11y': jsxA11yPlugin,
      'no-barrel-files': barrelPlugin,
      '@grafana': grafanaPlugin,
      unicorn: unicornPlugin,
      'react-prefer-function-component': reactPreferFunctionComponentPlugin,
    },

    settings: {
      'import/internal-regex': '^(app/)|(@grafana)',
      'import/external-module-folders': ['node_modules', '.yarn'],
      // Silences a warning when linting enterprise code
      react: {
        version: 'detect',
      },
    },

    rules: {
      'no-duplicate-case': 'error',
      '@grafana/no-border-radius-literal': 'error',
      '@grafana/no-unreduced-motion': 'error',
      '@grafana/no-restricted-img-srcs': 'error',
      'react-prefer-function-component/react-prefer-function-component': ['error', { allowJsxUtilityClass: true }],
      'react/prop-types': 'off',
      // need to ignore emotion's `css` prop, see https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unknown-property.md#rule-options
      'react/no-unknown-property': ['error', { ignore: ['css'] }],
      '@emotion/jsx-import': 'error',
      '@emotion/syntax-preference': [2, 'object'],
      'lodash/import-scope': [2, 'member'],
      'jest/no-focused-tests': 'error',
      'import/order': [
        'error',
        {
          pathGroups: [
            {
              pattern: 'img/**',
              group: 'internal',
            },
          ],
          groups: [['builtin', 'external'], 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc' },
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
      'no-restricted-imports': ['error', baseImportConfig],
      'no-restricted-globals': ['error'].concat(restrictedGlobals),

      // Use typescript's no-redeclare for compatibility with overrides
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': ['error'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          fixStyle: 'inline-type-imports',
        },
      ],
      'unicorn/no-empty-file': 'error',
      'no-constant-condition': 'error',
      '@grafana/define-feature-events': 'error',
      '@grafana/no-plain-links': 'error',
    },
  },

  {
    name: 'grafana/no-extensions-imports',
    files: ['public/**/*.{ts,tsx,js}'],
    ignores: ['public/app/extensions/**/*'],
    rules: {
      'no-restricted-imports': [
        'error',
        withBaseRestrictedImportsConfig({
          patterns: [
            {
              group: ['app/extensions', 'app/extensions/*'],
              message: 'Importing from app/extensions is not allowed',
            },
          ],
        }),
      ],
    },
  },
  {
    name: 'grafana/uplot-overrides',
    files: ['packages/grafana-ui/src/components/uPlot/**/*.{ts,tsx}'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off',
    },
  },
  {
    name: 'grafana/theme-demo-overrides',
    files: ['packages/grafana-ui/src/components/ThemeDemos/**/*.{ts,tsx}'],
    rules: {
      '@emotion/jsx-import': 'off',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    name: 'grafana/story-rules',
    files: ['packages/grafana-ui/src/**/*.story.tsx'],
    rules: {
      '@grafana/consistent-story-titles': 'error',
    },
  },
  {
    name: 'grafana/public-dashboards-overrides',
    files: ['public/dashboards/scripted*.js'],
    rules: {
      'no-redeclare': 'error',
      '@typescript-eslint/no-redeclare': 'off',
    },
  },
  {
    name: 'grafana/jsx-a11y-overrides',
    files: ['**/*.tsx'],
    ignores: ['**/*.{spec,test}.tsx'],
    plugins: {
      'jsx-a11y': jsxA11yPlugin,
    },
    rules: {
      ...jsxA11yPlugin.configs.recommended.rules,
      'jsx-a11y/no-autofocus': [
        'error',
        {
          ignoreNonDOM: true,
        },
      ],
      'jsx-a11y/label-has-associated-control': [
        'error',
        {
          controlComponents: ['NumberInput'],
          depth: 2,
        },
      ],
    },
  },

  {
    // No NPM package should import from @grafana/*/internal because it does not exist
    // outside of this repo - they're not published to NPM.
    name: 'grafana/packages',
    files: ['packages/**/*.{ts,tsx}'],
    ignores: [],
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/no-extraneous-dependencies': ['error', { includeInternal: true }],
      'no-restricted-imports': [
        'error',
        withBaseRestrictedImportsConfig({
          patterns: [
            {
              group: ['@grafana/*/internal'],
              message: "'internal' exports are not available in NPM packages because they are not published to NPM",
            },
          ],
        }),
      ],
    },
  },

  {
    // @grafana/runtime shouldn't be imported from our 'library' NPM packages
    name: 'grafana/packages-that-cant-import-runtime',
    files: [
      'packages/grafana-ui/**/*.{ts,tsx}',
      'packages/grafana-data/**/*.{ts,tsx}',
      'packages/grafana-schema/**/*.{ts,tsx}',
      'packages/grafana-e2e-selectors/**/*.{ts,tsx}',
    ],
    ignores: [],
    rules: {
      'no-restricted-imports': [
        'error',
        withBaseRestrictedImportsConfig({
          patterns: [
            {
              // Duplicated because these rules override the previous grafana/packages-overrides
              group: ['@grafana/*/internal'],
              message: "'internal' exports are not available in NPM packages because they are not published to NPM",
            },
            {
              group: ['@grafana/runtime'],
              message: "'@grafana/runtime' should not be imported from library packages",
            },
          ],
        }),
      ],
    },
  },

  {
    name: 'grafana/alerting-overrides',
    plugins: {
      unicorn: unicornPlugin,
      react: reactPlugin,
      '@grafana': grafanaPlugin,
    },
    files: ['public/app/features/alerting/**/*.{ts,tsx,js,jsx}', 'packages/grafana-alerting/**/*.{ts,tsx,js,jsx}'],
    rules: {
      'sort-imports': ['error', { ignoreDeclarationSort: true }],
      'dot-notation': 'error',
      'prefer-const': 'error',
      'react/no-unused-prop-types': 'error',
      'react/self-closing-comp': 'error',
      'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
      'unicorn/no-unused-properties': 'error',
      'no-nested-ternary': 'error',
    },
  },
  {
    name: 'grafana/css-in-js-validation-unified',
    plugins: {
      '@grafana': grafanaPlugin,
    },
    files: ['public/app/features/alerting/unified/**/*.{ts,tsx}'],
    rules: {
      '@grafana/no-invalid-css-properties': 'error',
    },
  },
  {
    // Sections of codebase that have all translation markup issues fixed
    name: 'grafana/i18n-overrides',
    plugins: {
      '@grafana': grafanaPlugin,
      '@grafana/i18n': grafanaI18nPlugin,
    },
    files: [
      'public/app/!(plugins)/**/*.{ts,tsx,js,jsx}',
      'packages/grafana-ui/**/*.{ts,tsx,js,jsx}',
      'packages/grafana-data/**/*.{ts,tsx,js,jsx}',
      'packages/grafana-sql/**/*.{ts,tsx,js,jsx}',
      'packages/grafana-prometheus/**/*.{ts,tsx,js,jsx}',
      ...pluginsToTranslate.map((plugin) => `${plugin}/**/*.{ts,tsx,js,jsx}`),
    ],
    ignores: [
      'public/test/**',
      '**/*.{test,spec,story}.{ts,tsx}',
      '**/{tests,__mocks__,__tests__,fixtures,spec,mocks}/**',
      '**/{test-utils,testHelpers,mocks}.{ts,tsx}',
      '**/mock*.{ts,tsx}',
    ],
    rules: {
      '@grafana/i18n/no-untranslated-strings': [
        'error',
        { calleesToIgnore: ['^css$', 'use[A-Z].*'], basePaths: ['public/app/features'] },
      ],
      '@grafana/i18n/no-translation-top-level': 'error',
    },
  },
  {
    name: 'grafana/tests',
    plugins: {
      'testing-library': testingLibraryPlugin,
      'jest-dom': jestDomPlugin,
      jest: jestPlugin,
    },
    files: [
      'public/app/features/alerting/**/__tests__/**/*.[jt]s?(x)',
      'public/app/features/alerting/**/?(*.)+(spec|test).[jt]s?(x)',
      'packages/{grafana-ui,grafana-alerting}/**/*.{spec,test}.{ts,tsx}',
    ],
    rules: {
      ...testingLibraryPlugin.configs['flat/react'].rules,
      ...jestDomPlugin.configs['flat/recommended'].rules,
      'testing-library/prefer-user-event': 'error',
      'jest/expect-expect': ['error', { assertFunctionNames: ['expect*', 'assert*', 'reducerTester'] }],
    },
  },
  {
    name: 'grafana/test-overrides-to-fix',
    plugins: {
      'testing-library': testingLibraryPlugin,
    },
    files: ['packages/grafana-ui/**/*.{spec,test}.{ts,tsx}'],
    rules: {
      // grafana-ui has lots of violations of direct node access and container methods, so disabling for now
      'testing-library/no-node-access': 'off',
      'testing-library/no-container': 'off',
    },
  },
  {
    name: 'grafana/test-disables',
    files: ['**/*.{spec,test}.{ts,tsx}'],
    rules: {
      'react/display-name': 'off',
      'react/no-children-prop': 'off',
    },
  },
  {
    name: 'grafana/explore-traceview-overrides',
    files: ['public/app/features/explore/TraceView/components/demo/**/*.{ts,tsx,js,jsx}'],
    rules: {
      'import/no-extraneous-dependencies': 'off',
    },
  },
  {
    name: 'grafana/decoupled-plugins-overrides',
    files: [
      'public/app/plugins/datasource/azuremonitor/**/*.{ts,tsx}',
      'public/app/plugins/datasource/cloud-monitoring/**/*.{ts,tsx}',
      'public/app/plugins/datasource/cloudwatch/**/*.{ts,tsx}',
      'public/app/plugins/datasource/grafana-postgresql-datasource/**/*.{ts,tsx}',
      'public/app/plugins/datasource/grafana-pyroscope-datasource/**/*.{ts,tsx}',
      'public/app/plugins/datasource/grafana-testdata-datasource/**/*.{ts,tsx}',
      'public/app/plugins/datasource/graphite/**/*.{ts,tsx}',
      'public/app/plugins/datasource/jaeger/**/*.{ts,tsx}',
      'public/app/plugins/datasource/loki/**/*.{ts,tsx}',
      'public/app/plugins/datasource/loki/**/*.{ts,tsx}',
      'public/app/plugins/datasource/mysql/**/*.{ts,tsx}',
      'public/app/plugins/datasource/opentsdb/**/*.{ts,tsx}',
      'public/app/plugins/datasource/parca/**/*.{ts,tsx}',
      'public/app/plugins/datasource/tempo/**/*.{ts,tsx}',
      'public/app/plugins/datasource/zipkin/**/*.{ts,tsx}',
    ],
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.ts', '.tsx'],
        },
      },
    },
    rules: {
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './public/app/plugins',
              from: './public',
              except: ['./app/plugins'],
              message: 'Core plugins are not allowed to depend on Grafana core packages',
            },
          ],
        },
      ],
    },
  },

  {
    // custom rule for Table to avoid performance regressions
    files: ['packages/grafana-ui/src/components/Table/TableNG/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        withBaseRestrictedImportsConfig({
          patterns: [
            ...datavizDefaultImportsRestrictions,
            {
              group: ['@grafana/data'],
              importNames: ['getFieldDisplayName'],
              message:
                'Using the method inside Table can have performance implications which are unnecessary. Instead, use the local `getDisplayName` from the table utils.',
            },
          ],
        }),
      ],
    },
  },

  {
    // custom rule for Table to avoid performance regressions
    files: ['packages/grafana-ui/src/components/Table/TableNG/Cells/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        withBaseRestrictedImportsConfig({
          patterns: [
            ...datavizDefaultImportsRestrictions,
            {
              group: ['@grafana/data'],
              importNames: ['getFieldDisplayName'],
              message:
                'Using the method inside Table can have performance implications which are unnecessary. Instead, use the local `getDisplayName` from the table utils.',
            },
            {
              group: ['**/themes/ThemeContext'],
              importNames: ['useStyles2', 'useTheme2'],
              message:
                'Do not use "useStyles2" or "useTheme2" in a cell directly. Instead, provide styles to cells via `getDefaultCellStyles` or `getCellSpecificStyles`.',
            },
          ],
        }),
      ],
    },
  },

  // other dataviz panels which should just get our default set of restrictions
  {
    files: ['public/app/plugins/panel/state-timeline/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        withBaseRestrictedImportsConfig({
          patterns: [...datavizDefaultImportsRestrictions],
        }),
      ],
    },
  },

  // Old betterer rules config:
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: [
      // FIXME: Remove once all enterprise issues are fixed -
      // we don't have a suppressions file/approach for enterprise code yet
      ...enterpriseIgnores,
      'packages/grafana-ui/src/components/Forms/Legacy/**',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@grafana/no-aria-label-selectors': 'error',
    },
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: [
      ...commonTestIgnores,
      // FIXME: Remove once all enterprise issues are fixed -
      // we don't have a suppressions file/approach for enterprise code yet
      ...enterpriseIgnores,
    ],
    rules: {
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
      '@grafana/no-direct-local-storage-access': 'error',
      '@grafana/require-no-margin': 'error',
      '@grafana/no-locale-compare': 'error',
      // eslint-disable-next-line @grafana/no-gf-form
      '@grafana/no-gf-form': 'error',
      '@grafana/no-config-apps': 'error',
      '@grafana/no-config-panels': 'error',
    },
  },
  {
    files: [...commonTestIgnores],
    ignores: [
      // FIXME: Remove once all enterprise issues are fixed -
      // we don't have a suppressions file/approach for enterprise code yet
      ...enterpriseIgnores,
    ],
    rules: {
      '@grafana/no-config-apps': 'error',
      '@grafana/no-config-panels': 'error',
    },
    plugins: {
      '@grafana': grafanaPlugin,
    },
  },
  {
    files: [...enterpriseIgnores],
    rules: {
      '@grafana/no-config-apps': 'error',
      '@grafana/no-config-panels': 'error',
    },
  },
  {
    files: ['public/app/**/*.{ts,tsx}'],
    ignores: [
      ...commonTestIgnores,
      // FIXME: Remove once all enterprise issues are fixed -
      // we don't have a suppressions file/approach for enterprise code yet
      ...enterpriseIgnores,
      // Ignore decoupled plugin webpack configs
      'public/app/**/webpack.config.ts',
    ],
    rules: {
      'no-barrel-files/no-barrel-files': 'error',
    },
  },

  {
    // @grafana/i18n shouldn't import from our 'library' NPM packages
    name: 'grafana/packages-that-i18n-cant-import',
    files: ['packages/grafana-i18n/**/*.{ts,tsx}'],
    ignores: [],
    rules: {
      'no-restricted-imports': [
        'error',
        withBaseRestrictedImportsConfig({
          patterns: [
            {
              group: ['@grafana/*'],
              message: "'@grafana/* packages' should not be imported in @grafana/i18n",
            },
          ],
        }),
      ],
    },
  },

  {
    name: 'grafana/stylex',
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@stylexjs': stylexPlugin,
      '@grafana': grafanaPlugin,
    },
    rules: {
      '@stylexjs/valid-styles': 'error',
      '@stylexjs/no-unused': 'error',
      '@stylexjs/no-legacy-contextual-styles': 'error',
      '@stylexjs/valid-shorthands': 'error',
      '@stylexjs/enforce-extension': 'error',
      '@grafana/stylex-no-unreduced-motion': 'error',
      '@grafana/stylex-no-border-radius-literal': 'error',
    },
  },
  {
    // Must come after grafana/packages-that-cant-import-runtime, whose restrictions it repeats.
    name: 'grafana/stylex-migrated-ui',
    files: stylexMigratedUiFiles,
    rules: {
      'no-restricted-imports': [
        'error',
        withBaseRestrictedImportsConfig({
          patterns: [
            {
              group: ['@grafana/*/internal'],
              message: "'internal' exports are not available in NPM packages because they are not published to NPM",
            },
            {
              group: ['@grafana/runtime'],
              message: "'@grafana/runtime' should not be imported from library packages",
            },
            ...stylexRestrictedImports.patterns,
          ],
          paths: stylexRestrictedImports.paths,
        }),
      ],
    },
  },

  {
    // Must come after grafana/no-extensions-imports, whose restriction it repeats.
    name: 'grafana/stylex-migrated-app',
    files: stylexMigratedAppFiles,
    ignores: stylexNotMigratedAppFiles,
    rules: {
      'no-restricted-imports': [
        'error',
        withBaseRestrictedImportsConfig({
          patterns: [
            {
              group: ['app/extensions', 'app/extensions/*'],
              message: 'Importing from app/extensions is not allowed',
            },
            ...stylexRestrictedImports.patterns,
          ],
          paths: stylexRestrictedImports.paths,
        }),
      ],
    },
  },

  // {
  //   name: 'grafana/plugin-external-import-paths',
  //   files: [
  //     'public/app/plugins/panel/histogram/**/*.{ts,tsx}',
  //   ],
  //   plugins: {
  //     '@grafana': grafanaPlugin,
  //   },
  //   rules: {
  //     '@grafana/no-plugin-external-import-paths': 'error',
  //   },
  // },
];
