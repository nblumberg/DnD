export function Login({ login }: { login: () => void }) {
  return (
    <div>
      <h1>D&D</h1>
      <button onClick={login}>Log in</button>
    </div>
  );
}
