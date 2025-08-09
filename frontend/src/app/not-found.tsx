import { ReactElement } from 'react';

export default function NotFound(): ReactElement {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>404</h1>
      <p>Сторінку не знайдено</p>
    </div>
  );
}
