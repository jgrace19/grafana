import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { navLandingPageStyles } from './NavLandingPage.stylex';
import * as React from 'react';

import { usePluginComponents, usePluginLinks } from '@grafana/runtime';
import { Page } from 'app/core/components/Page/Page';
import { useNavModel } from 'app/core/hooks/useNavModel';

import { NavLandingPageCard } from './NavLandingPageCard';

interface Props {
  navId: string;
  header?: React.ReactNode;
}

const EXTENSION_ID = (nodeId: string) => `grafana/dynamic/nav-landing-page/nav-id-${nodeId}/v1`;
const CARDS_EXTENSION_ID = (nodeId: string) => `grafana/dynamic/nav-landing-page/nav-id-${nodeId}/cards/v1`;

export function NavLandingPage({ navId, header }: Props) {
  const { node } = useNavModel(navId);
  const children = node.children?.filter((child) => !child.hideFromTabs);

  const { components, isLoading } = usePluginComponents<{
    node: NavModelItem;
  }>({
    extensionPointId: EXTENSION_ID(node.id ?? ''),
  });

  const { links: additionalCards, isLoading: isLoadingCards } = usePluginLinks({
    extensionPointId: CARDS_EXTENSION_ID(node.id ?? ''),
    context: { node },
  });

  // Warn if both extension points are being used (they are mutually exclusive)
  React.useEffect(() => {
    if (components && components.length > 0 && additionalCards && additionalCards.length > 0) {
      console.warn(
        `[NavLandingPage] Both NavLandingPage and NavLandingPageCards extensions are registered for "${node.id}". ` +
          `The NavLandingPage extension will take precedence and NavLandingPageCards will be ignored. ` +
          `Please use only one extension point.`
      );
    }
  }, [components, additionalCards, node.id]);

  if (isLoading || isLoadingCards) {
    return null;
  }

  return (
    <Page navId={node.id}>
      <Page.Contents>
        {components?.length > 0 ? (
          components.map((Component, idx) => <Component key={idx} node={node} />)
        ) : (
          <div {...stylex.props(navLandingPageStyles.content)}>
            {header}
            {children && children.length > 0 && (
              <section {...stylex.props(navLandingPageStyles.grid)}>
                {children?.map((child) => (
                  <NavLandingPageCard
                    key={child.id}
                    description={child.subTitle}
                    text={child.text}
                    url={child.url ?? ''}
                  />
                ))}
                {additionalCards?.map((link) => (
                  <NavLandingPageCard
                    key={link.id}
                    description={link.description}
                    text={link.title}
                    url={link.path ?? ''}
                    category={link.category}
                    onClick={link.onClick}
                  />
                ))}
              </section>
            )}
          </div>
        )}
      </Page.Contents>
    </Page>
  );
}

