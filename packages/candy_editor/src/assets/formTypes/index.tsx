import { CandyClassEditor } from '../../types';
import { NatForm } from './natForm';
import { TextForm } from './textForm';

export const FormTypes = {
  Text: (props: CandyClassEditor) => (
    <TextForm addPropertyToCandyClass={props.addPropertyToCandyClass} />
  ),
  Nat: () => <NatForm />,
};
