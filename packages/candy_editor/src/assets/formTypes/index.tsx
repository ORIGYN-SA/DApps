import React from 'react';
import { CandyClassEditor } from '../../types';
import { TextForm } from './TextForm/textForm';
import { NaturalsForm } from './NatForms/naturalsForm';
import { IntegersForm } from './IntForms/integersForm';
import { BoolForm } from './BoolForm/boolForm';
import { FloatForm } from './FloatForm/floatForm';
import { PrincipalForm } from './PrincipalForm/principalForm';

export const FormTypes = {
  Text: (props: CandyClassEditor) => (
    <TextForm
      addPropertyToCandyClass={props.addPropertyToCandyClass}
      candyType={props.candyType}
      editExistingProperty={props.editExistingProperty}
      editorMode={props.editorMode}
      property={props.property}
      removePropertyFromCandyClass={props.removePropertyFromCandyClass}
    />
  ),
  Nat: (props: CandyClassEditor) => (
    <NaturalsForm
      addPropertyToCandyClass={props.addPropertyToCandyClass}
      candyType={props.candyType}
      editExistingProperty={props.editExistingProperty}
      editorMode={props.editorMode}
      property={props.property}
      removePropertyFromCandyClass={props.removePropertyFromCandyClass}
    />
  ),
  Nat8: (props: CandyClassEditor) => (
    <NaturalsForm
      addPropertyToCandyClass={props.addPropertyToCandyClass}
      candyType={props.candyType}
      editExistingProperty={props.editExistingProperty}
      editorMode={props.editorMode}
      property={props.property}
      removePropertyFromCandyClass={props.removePropertyFromCandyClass}
    />
  ),
  Nat16: (props: CandyClassEditor) => (
    <NaturalsForm
      addPropertyToCandyClass={props.addPropertyToCandyClass}
      candyType={props.candyType}
      editExistingProperty={props.editExistingProperty}
      editorMode={props.editorMode}
      property={props.property}
      removePropertyFromCandyClass={props.removePropertyFromCandyClass}
    />
  ),
  Nat32: (props: CandyClassEditor) => (
    <NaturalsForm
      addPropertyToCandyClass={props.addPropertyToCandyClass}
      candyType={props.candyType}
      editExistingProperty={props.editExistingProperty}
      editorMode={props.editorMode}
      property={props.property}
      removePropertyFromCandyClass={props.removePropertyFromCandyClass}
    />
  ),
  Nat64: (props: CandyClassEditor) => (
    <NaturalsForm
      addPropertyToCandyClass={props.addPropertyToCandyClass}
      candyType={props.candyType}
      editExistingProperty={props.editExistingProperty}
      editorMode={props.editorMode}
      property={props.property}
      removePropertyFromCandyClass={props.removePropertyFromCandyClass}
    />
  ),
  Int: (props: CandyClassEditor) => (
    <IntegersForm
      addPropertyToCandyClass={props.addPropertyToCandyClass}
      candyType={props.candyType}
      editExistingProperty={props.editExistingProperty}
      editorMode={props.editorMode}
      property={props.property}
      removePropertyFromCandyClass={props.removePropertyFromCandyClass}
    />
  ),
  Int8: (props: CandyClassEditor) => (
    <IntegersForm
      addPropertyToCandyClass={props.addPropertyToCandyClass}
      candyType={props.candyType}
      editExistingProperty={props.editExistingProperty}
      editorMode={props.editorMode}
      property={props.property}
      removePropertyFromCandyClass={props.removePropertyFromCandyClass}
    />
  ),
  Int16: (props: CandyClassEditor) => (
    <IntegersForm
      addPropertyToCandyClass={props.addPropertyToCandyClass}
      candyType={props.candyType}
      editExistingProperty={props.editExistingProperty}
      editorMode={props.editorMode}
      property={props.property}
      removePropertyFromCandyClass={props.removePropertyFromCandyClass}
    />
  ),
  Int32: (props: CandyClassEditor) => (
    <IntegersForm
      addPropertyToCandyClass={props.addPropertyToCandyClass}
      candyType={props.candyType}
      editExistingProperty={props.editExistingProperty}
      editorMode={props.editorMode}
      property={props.property}
      removePropertyFromCandyClass={props.removePropertyFromCandyClass}
    />
  ),
  Int64: (props: CandyClassEditor) => (
    <IntegersForm
      addPropertyToCandyClass={props.addPropertyToCandyClass}
      candyType={props.candyType}
      editExistingProperty={props.editExistingProperty}
      editorMode={props.editorMode}
      property={props.property}
      removePropertyFromCandyClass={props.removePropertyFromCandyClass}
    />
  ),
  Bool: (props: CandyClassEditor) => (
    <BoolForm
      addPropertyToCandyClass={props.addPropertyToCandyClass}
      candyType={props.candyType}
      editExistingProperty={props.editExistingProperty}
      editorMode={props.editorMode}
      property={props.property}
      removePropertyFromCandyClass={props.removePropertyFromCandyClass}
    />
  ),
  Float: (props: CandyClassEditor) => (
    <FloatForm
      addPropertyToCandyClass={props.addPropertyToCandyClass}
      candyType={props.candyType}
      editExistingProperty={props.editExistingProperty}
      editorMode={props.editorMode}
      property={props.property}
      removePropertyFromCandyClass={props.removePropertyFromCandyClass}
    />
  ),
  Principal: (props: CandyClassEditor) => (
    <PrincipalForm
      addPropertyToCandyClass={props.addPropertyToCandyClass}
      candyType={props.candyType}
      editExistingProperty={props.editExistingProperty}
      editorMode={props.editorMode}
      property={props.property}
      removePropertyFromCandyClass={props.removePropertyFromCandyClass}
    />
  ),
};
