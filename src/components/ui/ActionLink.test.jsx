import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ActionLink from './ActionLink';

test('conserva descarga y destino y combina rel sin perder restricciones existentes', () => {
  render(<ActionLink href="/assets/cv.pdf" download target="_blank" rel="nofollow noopener">Ver mi CV</ActionLink>);
  const link = screen.getByRole('link', { name: 'Ver mi CV' });
  expect(link).toHaveAttribute('href', '/assets/cv.pdf');
  expect(link).toHaveAttribute('download');
  expect(link).toHaveAttribute('target', '_blank');
  expect(link.rel.split(' ')).toEqual(['nofollow', 'noopener', 'noreferrer']);
});

test('conserva las anclas nativas sin introducir navegación programática', () => {
  render(<ActionLink href="#contact" variant="primary">Hablemos</ActionLink>);
  const link = screen.getByRole('link', { name: 'Hablemos' });
  expect(link).toHaveAttribute('href', '#contact');
  expect(link).not.toHaveAttribute('target');
  expect(link).not.toHaveAttribute('role');
});
