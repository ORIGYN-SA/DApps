import { CandyClassEditor } from '../../types';
import { TextForm } from './textForm';

export const FormTypes = {
  Text: (props: CandyClassEditor) => (
    <TextForm addPropertyToCandyClass={props.addPropertyToCandyClass} />
  )
};
