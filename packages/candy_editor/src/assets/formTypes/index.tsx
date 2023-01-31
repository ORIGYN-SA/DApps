import React from 'react';
import { CandyClassEditor } from '../../types';
import { TextForm } from './TextForm/textForm';
import { NatForm } from './NatForms/natForm';
import { Nat8Form } from './NatForms/nat8Form';
import { Nat16Form } from './NatForms/nat16Form';
import { Nat32Form } from './NatForms/nat32Form';
import { Nat64Form } from './NatForms/nat64Form';
import { IntegersForm } from './IntForms/integersForm';

export const FormTypes = {
  Text: (props: CandyClassEditor) => (
    <TextForm addPropertyToCandyClass={props.addPropertyToCandyClass} candyType={props.candyType} />
  ),
  Nat: (props: CandyClassEditor) => (
    <NatForm addPropertyToCandyClass={props.addPropertyToCandyClass} candyType={props.candyType} />
  ),
  Nat8: (props: CandyClassEditor) => (
    <Nat8Form addPropertyToCandyClass={props.addPropertyToCandyClass} candyType={props.candyType} />
  ),
  Nat16: (props: CandyClassEditor) => (
    <Nat16Form addPropertyToCandyClass={props.addPropertyToCandyClass} candyType={props.candyType} />
  ),
  Nat32: (props: CandyClassEditor) => (
    <Nat32Form addPropertyToCandyClass={props.addPropertyToCandyClass} candyType={props.candyType} />
  ),
  Nat64: (props: CandyClassEditor) => (
    <Nat64Form addPropertyToCandyClass={props.addPropertyToCandyClass} candyType={props.candyType} />
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
};
