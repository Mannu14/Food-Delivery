import { useEffect, useState } from 'react';

function Loading() {

  useEffect(()=>{
    const outputDiv = document.getElementById('loding');
          const txt =`Data Loding`
          let i=0
          const IntervalId = setInterval(function(){
          outputDiv.innerHTML += txt[i];
              i++;
              if (i== txt.length) {
                  clearInterval(IntervalId);
              }
          },50);
  },[]);

  return (
    <>
    <section className="body-container">
      <div className="preloader-container">
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
        <span id="loding"></span>
        <div className="point-loader">
            <li className="ring-loader"></li>
            <li className="ring-loader"></li>
            <li className="ring-loader"></li>
            <li className="ring-loader"></li>
        </div>
      </div>
    </section>
    </>
  )
}

export default Loading
