import React from 'react';
import { render } from '@testUtils';
import {render, screen, cleanup, expect, describe, it, afterEach} from '@testing-library/react';
import data from './data';
import FormTab from '../components/nftTabs/FormTab';

describe('formtab', () => {
    it(' render form tab', () => {
        render(<FormTab />);
        expect(screen.getByText('owner').toBeInTheDocument());
        cleanup();
    });
});