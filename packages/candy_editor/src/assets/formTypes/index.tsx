import React from 'react';
import { CandyClassEditor } from '../../types';
import { TextForm } from './TextForm/textForm';
import { NatForm } from './NatForms/natForm';
import { Nat8Form } from './NatForms/nat8Form';
import { Nat16Form } from './NatForms/nat16Form';
import { Nat32Form } from './NatForms/nat32Form';
import { Nat64Form } from './NatForms/nat64Form';
import { IntForm } from './IntForms/intForm';
import { Int8Form } from './IntForms/int8Form';
import { Int16Form } from './IntForms/int16Form';
import { Int32Form } from './IntForms/int32Form';
import { Int64Form } from './IntForms/int64Form';

export const FormTypes = {
  Text: (props: CandyClassEditor) => (
    <TextForm addPropertyToCandyClass={props.addPropertyToCandyClass} />
  ),
  Nat: (props: CandyClassEditor) => (
    <NatForm addPropertyToCandyClass={props.addPropertyToCandyClass} />
  ),
  Nat8: (props: CandyClassEditor) => (
    <Nat8Form addPropertyToCandyClass={props.addPropertyToCandyClass} />
  ),
  Nat16: (props: CandyClassEditor) => (
    <Nat16Form addPropertyToCandyClass={props.addPropertyToCandyClass} />
  ),
  Nat32: (props: CandyClassEditor) => (
    <Nat32Form addPropertyToCandyClass={props.addPropertyToCandyClass} />
  ),
  Nat64: (props: CandyClassEditor) => (
    <Nat64Form addPropertyToCandyClass={props.addPropertyToCandyClass} />
  ),
  Int: (props: CandyClassEditor) => (
    <IntForm addPropertyToCandyClass={props.addPropertyToCandyClass} />
  ),
  Int8: (props: CandyClassEditor) => (
    <Int8Form addPropertyToCandyClass={props.addPropertyToCandyClass} />
  ),
  Int16: (props: CandyClassEditor) => (
    <Int16Form addPropertyToCandyClass={props.addPropertyToCandyClass} />
  ),
  Int32: (props: CandyClassEditor) => (
    <Int32Form addPropertyToCandyClass={props.addPropertyToCandyClass} />
  ),
  Int64: (props: CandyClassEditor) => (
    <Int64Form addPropertyToCandyClass={props.addPropertyToCandyClass} />
  ),
};
