// Copyright (c) 2016 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from 'react';

import PropTypes from 'prop-types';

import Animation from 'animation';
import {ANIMATED_SERIES_PROPS} from 'utils/series-utils';
import {DEFAULT_SIZE, DEFAULT_OPACITY} from 'theme';

import AbstractSeries from './abstract-series';

const predefinedClassName = 'rv-xy-plot__series rv-xy-plot__series--mark';
const DEFAULT_STROKE_WIDTH = 1;

class MarkSeries extends AbstractSeries {
  _renderCircle(d, i, strokeWidth, style) {
    const sizeFunctor = this._getAttributeFunctor('size');
    const opacityFunctor = this._getAttributeFunctor('opacity');
    const fillFunctor = this._getAttributeFunctor('fill') ||
      this._getAttributeFunctor('color');
    const strokeFunctor = this._getAttributeFunctor('stroke') ||
      this._getAttributeFunctor('color');
    const xFunctor = this._getAttributeFunctor('x');
    const yFunctor = this._getAttributeFunctor('y');

    const attrs = {
      r: sizeFunctor ? sizeFunctor(d) : DEFAULT_SIZE,
      cx: xFunctor(d),
      cy: yFunctor(d),
      style: {
        opacity: opacityFunctor ? opacityFunctor(d) : DEFAULT_OPACITY,
        stroke: strokeFunctor && strokeFunctor(d),
        fill: fillFunctor && fillFunctor(d),
        strokeWidth: strokeWidth || DEFAULT_STROKE_WIDTH,
        ...style
      },
      key: i,
      onClick: e => this._valueClickHandler(d, e),
      onContextMenu: e => this._valueRightClickHandler(d, e),
      onMouseOver: e => this._valueMouseOverHandler(d, e),
      onMouseOut: e => this._valueMouseOutHandler(d, e)
    };
    return <circle {...attrs} />;
  }

  render() {
    const {
      animation, className, data, marginLeft, marginTop, getNull, strokeWidth, style
    } = this.props;
    if (!data) {
      return null;
    }
    if (animation) {
      return (
        <Animation {...this.props} animatedProps={ANIMATED_SERIES_PROPS}>
          <MarkSeries {...this.props} animation={null}/>
        </Animation>
      );
    }

    return (
      <g className={`${predefinedClassName} ${className}`}
         ref="container"
         transform={`translate(${marginLeft},${marginTop})`}>
        {data.map((d, i) => {
          return getNull(d) && this._renderCircle(d, i, strokeWidth, style);
        })}
      </g>
    );
  }
}

MarkSeries.displayName = 'MarkSeries';
MarkSeries.propTypes = {
  ...AbstractSeries.propTypes,
  getNull: PropTypes.func,
  strokeWidth: PropTypes.number
};
MarkSeries.defaultProps = {
  getNull: () => true
};

export default MarkSeries;
