import React from 'react';
import { CandyClassEditor } from '../../types';
import { TextForm } from './TextForm/textForm';
import { NaturalsForm } from './NatForms/naturalsForm';
import { IntegersForm } from './IntForms/integersForm';
import { BoolsForm } from './BoolForm/boolsForm';

export const FormTypes = {
  Text: (props: CandyClassEditor) => (
    <TextForm addPropertyToCandyClass={props.addPropertyToCandyClass} candyType={props.candyType} />
  ),
  Nat: (props: CandyClassEditor) => (
    <NaturalsForm addPropertyToCandyClass={props.addPropertyToCandyClass} candyType={props.candyType} />
  ),
  Nat8: (props: CandyClassEditor) => (
    <NaturalsForm addPropertyToCandyClass={props.addPropertyToCandyClass} candyType={props.candyType} />
  ),
  Nat16: (props: CandyClassEditor) => (
    <NaturalsForm addPropertyToCandyClass={props.addPropertyToCandyClass} candyType={props.candyType} />
  ),
  Nat32: (props: CandyClassEditor) => (
    <NaturalsForm addPropertyToCandyClass={props.addPropertyToCandyClass} candyType={props.candyType} />
  ),
  Nat64: (props: CandyClassEditor) => (
    <NaturalsForm addPropertyToCandyClass={props.addPropertyToCandyClass} candyType={props.candyType} />
  ),
  Int: (props: CandyClassEditor) => (
    <IntegersForm addPropertyToCandyClass={props.addPropertyToCandyClass} candyType={props.candyType} />
  ),
  Int8: (props: CandyClassEditor) => (
    <IntegersForm addPropertyToCandyClass={props.addPropertyToCandyClass} candyType={props.candyType} />
  ),
  Int16: (props: CandyClassEditor) => (
    <IntegersForm addPropertyToCandyClass={props.addPropertyToCandyClass} candyType={props.candyType} />
  ),
  Int32: (props: CandyClassEditor) => (
    <IntegersForm addPropertyToCandyClass={props.addPropertyToCandyClass} candyType={props.candyType} />
  ),
  Int64: (props: CandyClassEditor) => (
    <IntegersForm addPropertyToCandyClass={props.addPropertyToCandyClass} candyType={props.candyType} />
  ),
  Bool: (props: CandyClassEditor) => (
    <BoolsForm addPropertyToCandyClass={props.addPropertyToCandyClass} candyType={props.candyType} />
  ),
};
