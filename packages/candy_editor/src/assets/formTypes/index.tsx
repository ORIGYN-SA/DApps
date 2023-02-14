import React from 'react';
import { CandyClassEditor } from '../../types';
import { TextForm } from './TextForm/textForm';
import { NaturalsForm } from './NatForms/naturalsForm';
import { IntegersForm } from './IntForms/integersForm';
import { BoolForm } from './BoolForm/boolForm';
import { FloatForm } from './FloatForm/floatForm';
import { PrincipalForm } from './PrincipalForm/principalForm';
import { BytesForm } from './BytesForm/bytesForm';

export const FormTypes = {
  Text: (props: CandyClassEditor) => (
    <TextForm
      addPropertyToCandyClass={props.addPropertyToCandyClass}
      candyType={props.candyType}
      editExistingProperty={props.editExistingProperty}
      editorMode={props.editorMode}
      property={props.property}
      propertyIndex={props.propertyIndex}
    />
  ),
  Nat: (props: CandyClassEditor) => (
    <NaturalsForm
      addPropertyToCandyClass={props.addPropertyToCandyClass}
      candyType={props.candyType}
      editExistingProperty={props.editExistingProperty}
      editorMode={props.editorMode}
      property={props.property}
      propertyIndex={props.propertyIndex}
    />
  ),
  Nat8: (props: CandyClassEditor) => (
    <NaturalsForm
      addPropertyToCandyClass={props.addPropertyToCandyClass}
      candyType={props.candyType}
      editExistingProperty={props.editExistingProperty}
      editorMode={props.editorMode}
      property={props.property}
      propertyIndex={props.propertyIndex}
    />
  ),
  Nat16: (props: CandyClassEditor) => (
    <NaturalsForm
      addPropertyToCandyClass={props.addPropertyToCandyClass}
      candyType={props.candyType}
      editExistingProperty={props.editExistingProperty}
      editorMode={props.editorMode}
      property={props.property}
      propertyIndex={props.propertyIndex}
    />
  ),
  Nat32: (props: CandyClassEditor) => (
    <NaturalsForm
      addPropertyToCandyClass={props.addPropertyToCandyClass}
      candyType={props.candyType}
      editExistingProperty={props.editExistingProperty}
      editorMode={props.editorMode}
      property={props.property}
      propertyIndex={props.propertyIndex}
    />
  ),
  Nat64: (props: CandyClassEditor) => (
    <NaturalsForm
      addPropertyToCandyClass={props.addPropertyToCandyClass}
      candyType={props.candyType}
      editExistingProperty={props.editExistingProperty}
      editorMode={props.editorMode}
      property={props.property}
      propertyIndex={props.propertyIndex}
    />
  ),
  Int: (props: CandyClassEditor) => (
    <IntegersForm
      addPropertyToCandyClass={props.addPropertyToCandyClass}
      candyType={props.candyType}
      editExistingProperty={props.editExistingProperty}
      editorMode={props.editorMode}
      property={props.property}
      propertyIndex={props.propertyIndex}
    />
  ),
  Int8: (props: CandyClassEditor) => (
    <IntegersForm
      addPropertyToCandyClass={props.addPropertyToCandyClass}
      candyType={props.candyType}
      editExistingProperty={props.editExistingProperty}
      editorMode={props.editorMode}
      property={props.property}
      propertyIndex={props.propertyIndex}
    />
  ),
  Int16: (props: CandyClassEditor) => (
    <IntegersForm
      addPropertyToCandyClass={props.addPropertyToCandyClass}
      candyType={props.candyType}
      editExistingProperty={props.editExistingProperty}
      editorMode={props.editorMode}
      property={props.property}
      propertyIndex={props.propertyIndex}
    />
  ),
  Int32: (props: CandyClassEditor) => (
    <IntegersForm
      addPropertyToCandyClass={props.addPropertyToCandyClass}
      candyType={props.candyType}
      editExistingProperty={props.editExistingProperty}
      editorMode={props.editorMode}
      property={props.property}
      propertyIndex={props.propertyIndex}
    />
  ),
  Int64: (props: CandyClassEditor) => (
    <IntegersForm
      addPropertyToCandyClass={props.addPropertyToCandyClass}
      candyType={props.candyType}
      editExistingProperty={props.editExistingProperty}
      editorMode={props.editorMode}
      property={props.property}
      propertyIndex={props.propertyIndex}
    />
  ),
  Bool: (props: CandyClassEditor) => (
    <BoolForm
      addPropertyToCandyClass={props.addPropertyToCandyClass}
      candyType={props.candyType}
      editExistingProperty={props.editExistingProperty}
      editorMode={props.editorMode}
      property={props.property}
      propertyIndex={props.propertyIndex}
    />
  ),
  Float: (props: CandyClassEditor) => (
    <FloatForm
      addPropertyToCandyClass={props.addPropertyToCandyClass}
      candyType={props.candyType}
      editExistingProperty={props.editExistingProperty}
      editorMode={props.editorMode}
      property={props.property}
      propertyIndex={props.propertyIndex}
    />
  ),
  Principal: (props: CandyClassEditor) => (
    <PrincipalForm
      addPropertyToCandyClass={props.addPropertyToCandyClass}
      candyType={props.candyType}
      editExistingProperty={props.editExistingProperty}
      editorMode={props.editorMode}
      property={props.property}
      propertyIndex={props.propertyIndex}
    />
  ),
  Bytes: (props: CandyClassEditor) => (
    <BytesForm
      addPropertyToCandyClass={props.addPropertyToCandyClass}
      candyType={props.candyType}
      editExistingProperty={props.editExistingProperty}
      editorMode={props.editorMode}
      property={props.property}
      propertyIndex={props.propertyIndex}
    />
  ),
};
