import './loading.css'
function LoadingShow({stroke='#88C5E1',width='40px',height='40px'}) {
  return (
    <>
      <section className="body-LoaderP">
        <svg className="spinner" viewBox="0 0 50 50" style={{ width, height }}>
          <circle className="path" stroke={`${stroke}`} cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
        </svg>
      </section>
    </>
  );
}

export default LoadingShow;
