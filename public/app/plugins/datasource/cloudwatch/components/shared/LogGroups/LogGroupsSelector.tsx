import * as stylex from '@stylexjs/stylex';
import { useEffect, useMemo, useState } from 'react';

import { type SelectableValue } from '@grafana/data';
import { EditorField } from '@grafana/plugin-ui';
import { Button, Checkbox, Icon, Label, LoadingPlaceholder, Modal, Select, Space, TextLink } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { type LogGroup } from '../../../dataquery.gen';
import { type DescribeLogGroupsRequest, type ResourceResponse, type LogGroupResponse } from '../../../resources/types';
import { Account, ALL_ACCOUNTS_OPTION } from '../Account';

import Search from './Search';
import './LogGroupsSelector.css';

type CrossAccountLogsQueryProps = {
  selectedLogGroups?: LogGroup[];
  accountOptions?: Array<SelectableValue<string>>;
  fetchLogGroups: (params: Partial<DescribeLogGroupsRequest>) => Promise<Array<ResourceResponse<LogGroupResponse>>>;
  variables?: string[];
  onChange: (selectedLogGroups: LogGroup[]) => void;
  onBeforeOpen?: () => void;
};

export const LogGroupsSelector = ({
  accountOptions = [],
  variables = [],
  fetchLogGroups,
  onChange,
  onBeforeOpen,
  ...props
}: CrossAccountLogsQueryProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectableLogGroups, setSelectableLogGroups] = useState<LogGroup[]>([]);
  const [selectedLogGroups, setSelectedLogGroups] = useState(props.selectedLogGroups ?? []);
  const [searchPhrase, setSearchPhrase] = useState('');
  const [searchAccountId, setSearchAccountId] = useState(ALL_ACCOUNTS_OPTION.value);
  const [isLoading, setIsLoading] = useState(false);
  const selectedLogGroupsCounter = useMemo(
    () => selectedLogGroups.filter((lg) => !lg.name?.startsWith('$')).length,
    [selectedLogGroups]
  );
  const variableOptions = useMemo(() => variables.map((v) => ({ label: v, value: v })), [variables]);
  const selectedVariable = useMemo(
    () => selectedLogGroups.find((lg) => lg.name?.startsWith('$'))?.name,
    [selectedLogGroups]
  );
  const currentVariableOption = {
    label: selectedVariable,
    value: selectedVariable,
  };

  useEffect(() => {
    setSelectedLogGroups(props.selectedLogGroups ?? []);
  }, [props.selectedLogGroups]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (isModalOpen) {
    } else {
      setSelectedLogGroups(selectedLogGroups);
      searchFn(searchPhrase, searchAccountId);
    }
  };

  const accountNameById = useMemo(() => {
    const idsToNames: Record<string, string> = {};
    accountOptions.forEach((a) => {
      if (a.value && a.label) {
        idsToNames[a.value] = a.label;
      }
    });
    return idsToNames;
  }, [accountOptions]);

  const searchFn = async (searchTerm?: string, accountId?: string) => {
    setIsLoading(true);
    try {
      const possibleLogGroups = await fetchLogGroups({
        logGroupPattern: searchTerm,
        accountId: accountId,
      });
      setSelectableLogGroups(
        possibleLogGroups.map((lg) => ({
          arn: lg.value.arn,
          name: lg.value.name,
          accountId: lg.accountId,
          accountLabel: lg.accountId ? accountNameById[lg.accountId] : undefined,
        }))
      );
    } catch (err) {
      setSelectableLogGroups([]);
    }
    setIsLoading(false);
  };

  const handleSelectCheckbox = (row: LogGroup, isChecked: boolean) => {
    if (isChecked) {
      setSelectedLogGroups([...selectedLogGroups, row]);
    } else {
      setSelectedLogGroups(selectedLogGroups.filter((lg) => lg.arn !== row.arn));
    }
  };

  const handleApply = () => {
    onChange(selectedLogGroups);
    toggleModal();
  };

  const handleCancel = () => {
    setSelectedLogGroups(selectedLogGroups);
    toggleModal();
  };

  return (
    <>
      <Modal
        className="gf-cloudwatch-log-groups-modal"
        title="Select log groups"
        isOpen={isModalOpen}
        onDismiss={toggleModal}
      >
        <div {...stylex.props(styles.logGroupSelectionArea)}>
          <div {...stylex.props(styles.searchField)}>
            <EditorField label="Log group name prefix">
              <Search
                searchFn={(phrase) => {
                  searchFn(phrase, searchAccountId);
                  setSearchPhrase(phrase);
                }}
                searchPhrase={searchPhrase}
              />
            </EditorField>
          </div>

          <Account
            onChange={(accountId?: string) => {
              searchFn(searchPhrase, accountId);
              setSearchAccountId(accountId || ALL_ACCOUNTS_OPTION.value);
            }}
            accountOptions={accountOptions}
            accountId={searchAccountId}
          />
        </div>
        <Space layout="block" v={2} />
        <div>
          {!isLoading && selectableLogGroups.length >= 25 && (
            <>
              <div className={`gf-cloudwatch-log-group-limit ${stylex.props(styles.limitLabel).className}`}>
                <Icon name="info-circle"></Icon>
                Only the first 50 results can be shown. If you do not see an expected log group, try narrowing down your
                search.
                <p>
                  A{' '}
                  <TextLink
                    external
                    href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/cloudwatch_limits_cwl.html"
                  >
                    maximum{' '}
                  </TextLink>{' '}
                  of 50 Cloudwatch log groups can be queried at one time.
                </p>
              </div>
              <Space layout="block" v={1} />
            </>
          )}
          <div {...stylex.props(styles.tableScroller)}>
            <table {...stylex.props(styles.table)}>
              <thead>
                <tr {...stylex.props(styles.row)}>
                  <td {...stylex.props(styles.cell)}>Log Group</td>
                  {accountOptions.length > 0 && <td {...stylex.props(styles.cell)}>Account label</td>}
                  <td {...stylex.props(styles.cell)}>Account ID</td>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr {...stylex.props(styles.row)}>
                    <td {...stylex.props(styles.cell)}>
                      <LoadingPlaceholder text={'Loading...'} />
                    </td>
                  </tr>
                )}
                {!isLoading && selectableLogGroups.length === 0 && (
                  <tr {...stylex.props(styles.row)}>
                    <td {...stylex.props(styles.cell)}>No log groups found</td>
                  </tr>
                )}
                {!isLoading &&
                  selectableLogGroups.map((row) => (
                    <tr {...stylex.props(styles.row)} key={`${row.arn}`}>
                      <td {...stylex.props(styles.cell)}>
                        <div {...stylex.props(styles.nestedEntry)}>
                          <Checkbox
                            id={row.arn}
                            onChange={(ev) => handleSelectCheckbox(row, ev.currentTarget.checked)}
                            value={!!(row.arn && selectedLogGroups.some((lg) => lg.arn === row.arn))}
                          />
                          <Space layout="inline" h={2} />
                          <label {...stylex.props(styles.logGroupSearchResults)} htmlFor={row.arn} title={row.name}>
                            {row.name}
                          </label>
                        </div>
                      </td>
                      {accountOptions.length > 0 && <td {...stylex.props(styles.cell)}>{row.accountLabel}</td>}
                      <td {...stylex.props(styles.cell)}>{row.accountId}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <Space layout="block" v={2} />
        <Label className="gf-cloudwatch-log-group-count">
          {selectedLogGroupsCounter} log group{selectedLogGroupsCounter !== 1 && 's'} selected
        </Label>
        <Space layout="block" v={1} />
        <EditorField
          label="Template variable"
          width={26}
          tooltip="Optionally you can specify a single or multi-valued template variable. Select a variable separately or in conjunction with log groups."
        >
          <Select
            isClearable
            aria-label="Template variable"
            value={currentVariableOption}
            allowCustomValue
            options={variableOptions}
            onChange={(option) => {
              const newValues = selectedLogGroups.filter((lg) => !lg.name?.startsWith('$'));
              if (option?.label) {
                newValues.push({ name: option.label, arn: option.label });
              }
              setSelectedLogGroups(newValues);
            }}
          />
        </EditorField>

        <Modal.ButtonRow>
          <Button onClick={handleCancel} variant="secondary" type="button" fill="outline">
            Cancel
          </Button>
          <Button onClick={handleApply} type="button">
            Add log groups
          </Button>
        </Modal.ButtonRow>
      </Modal>

      <div>
        <Button
          variant="secondary"
          onClick={() => {
            try {
              onBeforeOpen?.();
              toggleModal();
            } catch (err) {}
          }}
          type="button"
        >
          Select log groups
        </Button>
      </div>
    </>
  );
};

const styles = stylex.create({
  table: {
    width: '100%',
    tableLayout: 'fixed',
  },
  limitLabel: {
    color: colors['--gf-colors-text-secondary'],
    textAlign: 'center',
    maxWidth: 'none',
    fontSize: 12,
  },
  tableScroller: {
    maxHeight: '40vh',
    overflow: 'auto',
  },
  row: {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: {
      default: colors['--gf-colors-border-weak'],
      ':last-of-type': colors['--gf-colors-border-medium'],
    },
  },
  cell: {
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: {
      default: spacing['--gf-spacing-x0'],
      ':first-of-type': spacing['--gf-spacing-x2'],
    },
    width: {
      default: '25%',
      ':first-of-type': '80%',
    },
  },
  nestedEntry: {
    display: 'flex',
    alignItems: 'center',
  },
  logGroupSearchResults: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '90%',
    verticalAlign: 'middle',
  },
  logGroupSelectionArea: {
    display: 'flex',
  },
  searchField: {
    width: '100%',
    marginRight: spacing['--gf-spacing-x1'],
  },
});
