import React, { useState } from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import { ChevronDown16, ChevronUp16 } from '@carbon/icons-react';

import cx from 'classnames';

import { Row } from '../Grid';
import getTheme from './getTheme';

import styles from './Code.module.scss';

import PathRow from './PathRow';
import Sidebar from './Sidebar';

import useMetadata from '../../util/hooks/useMetadata';

const Code = ({
  children,
  className: classNameProp = '',
  overflowAfter: overflowAfterProp = 9,
  path,
  src,
}) => {
  const overflowAfter = Number(overflowAfterProp); // MDX parses this as a string
  const isOverflowEnabled = overflowAfter > 0;
  const shouldOverflow = children.split('\n').length > overflowAfter;
  const [isOverflowExpanded, setOverflowExpanded] = useState(false);

  const { interiorTheme } = useMetadata();

  const language = classNameProp.replace(/language-/, '').replace('mdx', 'jsx');

  const removeTrailingEmptyLine = (lines) => {
    const [lastLine] = lines.splice(-1);
    if (lastLine[0].empty) {
      return lines;
    }
    return [...lines, lastLine];
  };

  const getLines = (lines) => {
    const withoutTrailingEmpty = removeTrailingEmptyLine(lines);

    if (!isOverflowEnabled || isOverflowExpanded) {
      return withoutTrailingEmpty;
    }

    return withoutTrailingEmpty.slice(0, overflowAfter);
  };

  return (
    <Row className={cx(styles.row)}>
      <PathRow src={src} path={path}>
        {children}
      </PathRow>
      <Highlight
        {...defaultProps}
        code={children}
        language={language}
        theme={getTheme(interiorTheme)}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <div className={styles.container}>
            <pre
              className={cx(styles.highlight, {
                [styles.sideBarMinHeight]: !path && src,
                [className]: className,
              })}
              style={style}>
              {getLines(tokens).map((line, i) => (
                <div {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
            <Sidebar path={path} src={src}>
              {children}
            </Sidebar>
          </div>
        )}
      </Highlight>
      {isOverflowEnabled && shouldOverflow && (
        <button
          className={cx(styles.showMoreButton, {
            [styles.showMoreButton__inline]:
              !isOverflowExpanded && overflowAfter <= 2,
            [styles.dark]: interiorTheme === 'dark',
          })}
          onClick={() => setOverflowExpanded(!isOverflowExpanded)}
          type="button">
          {isOverflowExpanded ? (
            <>
              <span>Show less</span>
              <ChevronUp16 />
            </>
          ) : (
            <>
              <span>Show more</span>
              <ChevronDown16 />
            </>
          )}
        </button>
      )}
    </Row>
  );
};

export default Code;
