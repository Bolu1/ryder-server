
import React, {Component, Fragment} from 'react';
import './dropzone.style.scss';
import pictureIcon from 'assets/images/cloud-upload.png';
import cancelIcon from '../../assets/images/close.png';

class DropZone extends Component{
    constructor(props){
        super(props);
        //@ts-ignore
        this.myRef = React.createRef();
        //@ts-ignore
        this.deleteRef = React.createRef();
        this.state = {
            acceptedFile: {},
            error:{},
            fileUrl:'',
        }
    }


    dragOver = (e) => {
        e.preventDefault();
    }

    dragEnter = (e) => {
        e.preventDefault();
    }

    dragLeave = (e) => {
        e.preventDefault();
    }

    fileDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if(files.length){
            this.getProgress(files);
        }
          
    }

    filesSelected = (e) => {
        if (this.myRef.current.files.length) {
            this.getProgress(this.myRef.current.files);
         
        }
    }

    getProgress = (file) => {
        const {updateFileUrl} = this.props;
     
        const fileUrlAddress = window.URL.createObjectURL(file[0]);
        this.setState({
            acceptedFile: file,
            fileUrl: fileUrlAddress,
        });
        
        updateFileUrl(file);
  
        
    }

    fileInputClicked = (e) => {
       
        if(e.target.id === 'drop'){
            this.myRef.current.click();
       }
    }

    emptyFileInputClicked = (e) => {
         if(e.target.id === 'empty-drop'){
            this.myRef.current.click();
       }
    }

    removeFile = () => {
        const {updateFileUrl} = this.props;
        document.getElementById('file').value = null;
        this.setState({
            acceptedFile: {},
            fileUrl: '',
        });
        
        updateFileUrl(null);
    }

    render = () => {
        const { 
            fileUrl
        } = this.state;
        return (
            <>
                <div 
                   
                    onDragOver={this.dragOver}
                    onDragEnter={this.dragEnter}
                    onDragLeave={this.dragLeave}
                    onDrop={this.fileDrop}
                    onClick={(e)=>this.fileInputClicked(e)}
                    className="dropzone d-flex" 
                    id="drop"
                >
                {fileUrl? (
                    <>
                   
                        <div className={` img-div w-100`}>
                                
                            <img className={`cancel-button pointer `} src={cancelIcon} alt="cancel"  id='cancel'  data-type="remove-image" onClick={(e)=>this.removeFile()} />
                               
                            <img src={fileUrl} className="drop-zone-img dz-image mx-auto" alt="viewimage" />
                        
                        </div>
                        
                   
                    </>
                ):(

                    <div className="w-100 text-center" id="empty-drop" onClick={(e)=>this.emptyFileInputClicked(e)}>
                        <img src={pictureIcon}  width={80} height={80} />
                        
                        <h6 className="mt-3 text-muted">Drag and drop a cover photo here</h6>
                        <span className="text-center text-muted">OR</span>
                        <h6 className="mt-3 text-muted">Click to upload picture</h6>
                    </div>
                )}
                
                 <input
                        ref={this.myRef}
                        className="file-input"
                        id='file'
                        type="file"
                        onChange={(e)=>this.filesSelected(e)}
                    />
                    {/* <div className="dz-message needsclick">
                        <i className="fa fa-picture-o fa-5x" aria-hidden="true"/>
                    </div> */}
                </div>
            </>
        );
    }

}
export default DropZone;
