import { Builder, type Config, type ImmutableTree, Query, Utils } from '@react-awesome-query-builder/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { type SQLExpression } from '../../types';

import { emptyInitTree, raqbConfig } from './AwesomeQueryBuilder';
import './WhereRow.css';

interface SQLBuilderWhereRowProps {
  sql: SQLExpression;
  onSqlChange: (sql: SQLExpression) => void;
  config?: Partial<Config>;
}

export function WhereRow({ sql, config, onSqlChange }: SQLBuilderWhereRowProps) {
  const [tree, setTree] = useState<ImmutableTree>();
  const configWithDefaults = useMemo(() => ({ ...raqbConfig, ...config }), [config]);

  useEffect(() => {
    if (!tree) {
      const initTree = Utils.checkTree(Utils.loadTree(sql.whereJsonTree ?? emptyInitTree), configWithDefaults);
      setTree(initTree);
    }
  }, [configWithDefaults, sql.whereJsonTree, tree]);

  useEffect(() => {
    if (!sql.whereJsonTree) {
      setTree(Utils.checkTree(Utils.loadTree(emptyInitTree), configWithDefaults));
    }
  }, [configWithDefaults, sql.whereJsonTree]);

  const onTreeChange = useCallback(
    (changedTree: ImmutableTree, config: Config) => {
      setTree(changedTree);
      const newSql = {
        ...sql,
        whereJsonTree: Utils.getTree(changedTree),
        whereString: Utils.sqlFormat(changedTree, config),
      };

      onSqlChange(newSql);
    },
    [onSqlChange, sql]
  );

  if (!tree) {
    return null;
  }

  return (
    <Query
      {...configWithDefaults}
      value={tree}
      onChange={onTreeChange}
      renderBuilder={(props) => <Builder {...props} />}
    />
  );
}
