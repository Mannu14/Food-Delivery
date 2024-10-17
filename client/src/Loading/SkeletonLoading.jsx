import './loading.css';

function SkeletonLoading({ Mwidth, MPadding,MDisplay, width1, height1, borderRadius1, margin1, width2, height2, borderRadius2, margin2,background2,
    width3, height3, borderRadius3, margin3, width4, height4, borderRadius4, margin4, width5, height5, borderRadius5, margin5,
    animation1,animation2,animation3,animation4,animation5
}) {

    return (
        <div className="main-item" style={{ width: Mwidth, padding: MPadding}}>
            <div className="css-dom" style={{display:MDisplay}}>
                {(width1 || height1 || borderRadius1 || margin1) &&
                    <div style={{
                        backgroundColor:'#eeeeee',
                        margin: margin1, borderRadius: borderRadius1, width: width1, height: height1,
                    }}></div>
                }
                {(width2 || height2 || borderRadius2 || margin2) &&
                    <div style={{
                        background:`${background2?background2:'linear-gradient(to right, #eeeeee 8%, #bbbbbb 18%, #eeeeee 33%)'}`, animation: `placeHolderShimmer ${animation2 ?animation2:2}s infinite linear forwards`,
                        margin: margin2, borderRadius: borderRadius2, width: width2, height: height2
                    }}></div>
                }
                {(width3 || height3 || borderRadius3 || margin3) &&
                    <div style={{
                        background: 'linear-gradient(to right, #eeeeee 8%, #bbbbbb 18%, #eeeeee 33%)', animation: `placeHolderShimmer ${animation3 ?animation3:2}s infinite linear forwards`,
                        margin: margin3, borderRadius: borderRadius3, width: width3, height: height3
                    }}></div>
                }
                {(width4 || height4 || borderRadius4 || margin4) &&
                    <div style={{
                        background: 'linear-gradient(to right, #eeeeee 8%, #bbbbbb 18%, #eeeeee 33%)', animation: `placeHolderShimmer ${animation4 ?animation4:2}s infinite linear forwards`,
                        margin: margin4, borderRadius: borderRadius3, width: width3, height: height3
                    }}></div>
                }
                {(width5 || height5 || borderRadius5 || margin5) &&
                    <div style={{
                        background: 'linear-gradient(to right, #eeeeee 8%, #bbbbbb 18%, #eeeeee 33%)', animation: `placeHolderShimmer ${animation5 ?animation5:2}s infinite linear forwards`,
                        margin: margin5, borderRadius: borderRadius3, width: width3, height: height3
                    }}></div>
                }
            </div>
        </div>
    );
}

export { SkeletonLoading };
