import React, { FC } from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector, useDispatch, connect } from "react-redux";
import NoAccess from "utilComponents/NoAccess";

interface Props {
    component: any,
    layout?: any,
    isAuthProtected: boolean,
    path: string,
	exact?: boolean,
	permission?: any,
	loggedInUserPermissionObj?: any
    // any props that come into the component
}
const AppRoute: FC<Props> = ({component: Component, layout: Layout, permission, isAuthProtected, loggedInUserPermissionObj,  ...rest }) => (
		<Route
			render={props  => {
				if(Layout){
					permission = permission? permission : '';
					let formatedPermission = permission.toUpperCase();
					formatedPermission = formatedPermission.replace(/ /g,"_");
					if(isAuthProtected){
						if((!loggedInUserPermissionObj[formatedPermission]) && (permission)){
							return (
								<Layout>
									<NoAccess />
								</Layout>
							);
						}
					}
					return (
						<Layout>
							<Component {...props} />
						</Layout>
					);
				}else{

					return (
						<>
							<Component {...props} />
						</>
					)
				}

				
			}}
			{...rest}
			exact={true}
		/>
	);
const mapStatetoProps = (state: any) => {
	
	return {loggedInUserPermissionObj: state?.reducer?.userObject?.permissionsObject || {}};
}
export default connect(mapStatetoProps)(AppRoute)
