import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

function renderApp(path = '/dashboard') {
  return render(<MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><App /></MemoryRouter>);
}

beforeEach(() => {
  window.localStorage.clear();
});

test('renders the security dashboard and seeded incident data', () => {
  renderApp();
  expect(screen.getByRole('heading', { name: /security operations, at a glance/i })).toBeInTheDocument();
  expect(screen.getByText(/Suspicious sign-in from unfamiliar location/)).toBeInTheDocument();
  expect(screen.getByText('Total tasks')).toBeInTheDocument();
});

test('navigates to task management and switches the interface to French RTL-aware locale', () => {
  renderApp();
  fireEvent.click(screen.getByRole('link', { name: 'Tasks' }));
  expect(screen.getByRole('heading', { name: 'Task management' })).toBeInTheDocument();
  fireEvent.change(screen.getByRole('combobox', { name: 'Language' }), { target: { value: 'fr' } });
  expect(screen.getByRole('heading', { name: 'Gestion des tâches' })).toBeInTheDocument();
  expect(document.documentElement.lang).toBe('fr');
  expect(document.documentElement.dir).toBe('ltr');
});

test('switches to Arabic and applies an RTL document direction', () => {
  renderApp();
  fireEvent.change(screen.getByRole('combobox', { name: 'Language' }), { target: { value: 'ar' } });
  expect(screen.getByRole('heading', { name: 'عمليات الأمن السيبراني في لمحة.' })).toBeInTheDocument();
  expect(document.documentElement.lang).toBe('ar');
  expect(document.documentElement.dir).toBe('rtl');
});

test('creates a task and saves it to browser storage', () => {
  renderApp();
  fireEvent.click(screen.getByRole('button', { name: 'New task' }));
  fireEvent.change(screen.getByPlaceholderText('e.g. Review endpoint alerts'), { target: { value: 'Verify backup alerts' } });
  fireEvent.change(screen.getByPlaceholderText('Add context and expected outcome...'), { target: { value: 'Check the backup monitoring workflow.' } });
  fireEvent.change(screen.getByLabelText('Due date *'), { target: { value: '2026-11-05' } });
  fireEvent.click(screen.getByRole('button', { name: 'Create task' }));
  const savedTasks = JSON.parse(window.localStorage.getItem('securenexus.tasks'));
  expect(savedTasks[0].title).toBe('Verify backup alerts');
  expect(screen.getByRole('status')).toHaveTextContent('Changes saved');
});

test('reports an incident and assigns a unique incident reference', () => {
  renderApp('/incidents');
  fireEvent.click(screen.getByRole('button', { name: 'Report incident' }));
  fireEvent.change(screen.getByLabelText('Title *'), { target: { value: 'Unexpected admin login' } });
  fireEvent.change(screen.getByLabelText('Description *'), { target: { value: 'Review the account sign-in activity.' } });
  fireEvent.change(screen.getByLabelText('Affected system / asset *'), { target: { value: 'identity-prod' } });
  fireEvent.click(screen.getByRole('button', { name: 'Create incident' }));
  const savedIncidents = JSON.parse(window.localStorage.getItem('securenexus.incidents'));
  expect(savedIncidents[0].id).toBe('INC-2026-085');
  expect(savedIncidents[0].title).toBe('Unexpected admin login');
});
