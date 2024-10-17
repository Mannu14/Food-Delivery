import './loading.css'
function Loading() {
    return (
      <>
        <section className="body-LoaderP" style={{marginBottom:'100px'}}>
          <div className="Loader-ring">
          <div className="loader"></div> <p style={{marginLeft:'10px',fontSize:'14px',color:'#ccc'}}>loading....</p>
          </div>
        </section>
      </>
    );
  }
  
export default Loading;