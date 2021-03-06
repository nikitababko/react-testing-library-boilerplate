import React from 'react';
import { render, screen, fireEvent, findAllByRole, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App';
import axios from 'axios';

jest.mock('axios');

const hits = [
  {
    objectID: '1',
    title: 'Angular',
  },
  {
    objectID: '2',
    title: 'React',
  },
];

describe('App', () => {
  it('Fetches news from an API', async () => {
    axios.get.mockImplementationOnce(() => {
      return Promise.resolve({
        data: { hits },
      });
    });

    const { getByRole, findAllByRole } = render(<App />);

    userEvent.click(getByRole('button'));
    const items = await findAllByRole('listitem');
    expect(items).toHaveLength(2);

    // Additional
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      'http://hn.algolia.com/api/v1/search?query=React'
    );
  });

  it('Fetches news from an API and reject', async () => {
    axios.get.mockImplementationOnce(() => {
      return Promise.reject(new Error());
    });

    const { getByRole, findByText } = render(<App />);

    userEvent.click(getByRole('button'));
    const message = await findByText(/Something went wrong/);
    expect(message).toBeInTheDocument();
  });

  it('Fetches news from an API (alternative)', async () => {
    const promise = Promise.resolve({
      data: { hits },
    });
    axios.get.mockImplementationOnce(() => promise);

    const { getByRole, getAllByRole } = render(<App />);

    userEvent.click(getByRole('button'));
    await act(() => promise);
    expect(getAllByRole('listitem')).toHaveLength(2);
  });
});
