import React, {useReducer} from 'react';
import PageTitle from 'components/PageTitle';
import './merchandise.scss';
import { Link } from 'react-router-dom';
import cautionIcon from 'assets/images/caution.png';
import maskIcon from 'assets/images/mask.png';
import shirtIcon from 'assets/images/shirt.png';
import { DotsVertical, Plus } from 'tabler-icons-react';
import ActionButton from 'utilComponents/ActionButton';
import CreateButton from 'utilComponents/CreateButton';
import { history } from 'helpers';
const Merchandise = ():JSX.Element => {

    return(
        <>
            <div className="col-md-12 px-0">
                <PageTitle text='Merchandise' />
            </div>
            <div className="row merchandise">
                <div className="col-md-6">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card merchandise-card p-3 shadow-sm">
                                <div className="d-flex justify-content-between">
                                    <h6 className="text-muted">Orders</h6>
                                    <Link to="/order/view-all">
                                        view all
                                    </Link>
                                </div>
                                <div>
                                    <h4>60</h4>
                                </div>
                                
                            </div>

                        </div>
                        <div className="col-md-6">
                            <div className="card merchandise-card p-3 shadow-sm">
                                <div className="d-flex justify-content-between">
                                    <h6 className="text-muted">Products</h6>
                                    <Link to="/order/view-all">
                                        view all
                                    </Link>
                                </div>
                                <div>
                                    <h4>40</h4>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-md-12">
                            <div className="card merchandise-card p-3 shadow-sm">
                                <div className="d-flex justify-content-between">
                                    <p className="font-weight-bold h6">Inventory caution&nbsp;<img src={cautionIcon} /></p>
                                    <Link to="/inventory/view-all">
                                        view all
                                    </Link>
                                </div>
                                <div className="d-flex justify-content-between pt-2 my-2">
                                    <div className="d-flex pointer justify-content-between">
                                        <img src={maskIcon} width={40} height={40}/>
                                        <p>
                                            Facial mask
                                            <div className="text-muted small">
                                                xyz-9235&nbsp;&nbsp;&nbsp;<span className="text-danger">2 left in stock</span>
                                            </div>
                                        </p>
                                    </div>
                                    <div className="pointer">
                                    <DotsVertical
                                        size={20}
                                        strokeWidth={2}
                                        color={'black'}
                                    />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between pt-2 my-2">
                                    <div className="d-flex pointer justify-content-between">
                                        <img src={maskIcon} width={40} height={40}/>
                                        <p>
                                            Facial mask
                                            <div className="text-muted small">
                                                xyz-9235&nbsp;&nbsp;&nbsp;<span className="text-danger">2 left in stock</span>
                                            </div>
                                        </p>
                                    </div>
                                    <div className="pointer">
                                    <DotsVertical
                                        size={20}
                                        strokeWidth={2}
                                        color={'black'}
                                    />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between pt-2 my-2">
                                    <div className="d-flex pointer justify-content-between">
                                        <img src={maskIcon} width={40} height={40}/>
                                        <p>
                                            Facial mask
                                            <div className="text-muted small">
                                                xyz-9235&nbsp;&nbsp;&nbsp;<span className="text-danger">2 left in stock</span>
                                            </div>
                                        </p>
                                    </div>
                                    <div className="pointer">
                                    <DotsVertical
                                        size={20}
                                        strokeWidth={2}
                                        color={'black'}
                                    />
                                    </div>
                                </div>
                            </div>

                        </div>
                        
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card p-3">
                        <div className="d-flex justify-content-between">
                            <div className="d-flex align-items-center">
                                <p className="mb-0 h6">Latest Orders</p>
                                <div className="tab-count text-center">60</div>
                            </div>
                            <Link to="/order/view-all">
                                view all
                            </Link>
                        </div>

                        <div className="shadow-sm my-3 px-3">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6>ORD - 1003</h6>
                                </div>
                                <div>
                                    <p className="text-danger mb-0 small">Pending</p>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-end my-2">
                                <div className="d-flex">
                                    <img src={shirtIcon} />
                                    <div>
                                        &nbsp;&nbsp;&nbsp;&nbsp;Devoted T-shirt
                                        <div className="small text-muted">
                                            &nbsp;&nbsp;&nbsp;&nbsp;and 2 more items
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="small text-muted">
                                        2 days ago
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-end my-2 mt-3">
                                <small>Order by:&nbsp;&nbsp;<span className="font-weight-bold text-muted">Lebron James</span> </small>
                                <div>
                                    <ActionButton
                                        text={
                                            <>
                                                Accept
                                            </>
                                        }
                                        className="edit-action mr-3"
                                        actionEvent={()=> console.log('me')}
                                    />
                                    <span/>
                                    <ActionButton
                                        text={
                                            <>
                                                Decline
                                            </>
                                        }
                                        className="reject-action"
                                        actionEvent={()=> console.log('me')}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="shadow-sm my-3 px-3">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6>ORD - 1003</h6>
                                </div>
                                <div>
                                    <p className="text-danger mb-0 small">Pending</p>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-end my-2">
                                <div className="d-flex">
                                    <img src={shirtIcon} />
                                    <div>
                                        &nbsp;&nbsp;&nbsp;&nbsp;Devoted T-shirt
                                        <div className="small text-muted">
                                            &nbsp;&nbsp;&nbsp;&nbsp;and 2 more items
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="small text-muted">
                                        2 days ago
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-end my-2 mt-3">
                                <small>Order by:&nbsp;&nbsp;<span className="font-weight-bold text-muted">Lebron James</span> </small>
                                <div>
                                    <ActionButton
                                        text={
                                            <>
                                                Accept
                                            </>
                                        }
                                        className="edit-action mr-3"
                                        actionEvent={()=> console.log('me')}
                                    />
                                    <span/>
                                    <ActionButton
                                        text={
                                            <>
                                                Decline
                                            </>
                                        }
                                        className="reject-action"
                                        actionEvent={()=> console.log('me')}
                                    />
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div>
                <CreateButton
                    text={
                        <>
                            <Plus
                                size={20}
                                strokeWidth={2}
                                color={'white'}
                            />
                            &nbsp;
                            ADD NEW PRODUCT
                        </>
                    }
                    float
                    actionEvent={()=> history.push('/products/create')}
                />
                
            </div>
        </>
    )

};
export default Merchandise;