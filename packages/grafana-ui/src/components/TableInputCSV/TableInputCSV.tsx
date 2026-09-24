import * as stylex from '@stylexjs/stylex';
import { debounce } from 'lodash';
import { PureComponent } from 'react';
import * as React from 'react';

import { type DataFrame, type CSVConfig, readCSV } from '@grafana/data';
import { t, Trans } from '@grafana/i18n';

import { colors, spacing } from '../../themes/stylex/tokens.stylex';
import { Icon } from '../Icon/Icon';
import { TextArea } from '../TextArea/TextArea';

interface Props {
  config?: CSVConfig;
  text: string;
  width: string | number;
  height: string | number;
  onSeriesParsed: (data: DataFrame[], text: string) => void;
}

interface State {
  text: string;
  data: DataFrame[];
}

/**
 * Expects the container div to have size set and will fill it 100%
 */
export class UnThemedTableInputCSV extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    const { text, config } = props;
    this.state = {
      text,
      data: readCSV(text, { config }),
    };
  }

  readCSV = debounce(() => {
    const { config } = this.props;
    const { text } = this.state;

    this.setState({ data: readCSV(text, { config }) });
  }, 150);

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { text } = this.state;

    if (text !== prevState.text || this.props.config !== prevProps.config) {
      this.readCSV();
    }

    // If the props text has changed, replace our local version
    if (this.props.text !== prevProps.text && this.props.text !== text) {
      this.setState({ text: this.props.text });
    }

    if (this.state.data !== prevState.data) {
      this.props.onSeriesParsed(this.state.data, this.state.text);
    }
  }

  onTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ text: event.target.value });
  };

  render() {
    const { width, height } = this.props;
    const { data } = this.state;
    return (
      <div {...stylex.props(styles.tableInputCsv)}>
        <TextArea
          style={{ width, height }}
          placeholder={t('grafana-ui.table.csv-placeholder', 'Enter CSV here...')}
          value={this.state.text}
          onChange={this.onTextChange}
          className={stylex.props(styles.textarea).className}
        />
        {data && (
          <footer {...stylex.props(styles.footer)}>
            {data.map((frame, index) => {
              const rows = frame.length;
              const columns = frame.fields.length;
              return (
                <span key={index}>
                  <Trans i18nKey="grafana-ui.table.csv-counts">
                    Rows:{{ rows }}, Columns:{{ columns }}
                  </Trans>
                  &nbsp;
                  <Icon name="check-circle" />
                </span>
              );
            })}
          </footer>
        )}
      </div>
    );
  }
}

/**
 * @deprecated
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/inputs-deprecated-tableinputcsv--docs
 */
export const TableInputCSV: React.FunctionComponent<Props> = (props) => <UnThemedTableInputCSV {...props} />;
TableInputCSV.displayName = 'TableInputCSV';

const styles = stylex.create({
  tableInputCsv: {
    position: 'relative',
  },
  textarea: {
    height: '100%',
    width: '100%',
  },
  footer: {
    position: 'absolute',
    bottom: '15px',
    right: '15px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-success-border'],
    backgroundColor: colors['--gf-colors-success-main'],
    color: colors['--gf-colors-success-contrast-text'],
    paddingTop: '1px',
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
    paddingBottom: '1px',
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
    fontSize: '80%',
  },
});
