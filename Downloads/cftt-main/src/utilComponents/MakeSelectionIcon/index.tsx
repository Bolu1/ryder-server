import React from 'react';
import selectIcon from 'assets/images/select.png';
 const MakeSelection= () => {

    return(
        <>
            <div className="row">
                <div className="col-md-12 mt-0 mb-5 text-center">
                    
                    <img
                        alt={'Select a record'}
                        height="300px"
                        
                        src={selectIcon}
                        width="300px"
                    />
                    <p
                        className="text-center h5 font-weight-bold"
                        // style={{'marginTop':'-50px'}}
                    > Select a record</p>
                </div>

            </div>
        </>
    )
};

export default MakeSelection;
