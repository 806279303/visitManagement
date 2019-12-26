import { getVisitorRootAPI } from '../network/service';
import { transmitGet, transmitPost, transmitPut, transmitDelete } from '../network/network';





//黑白名单接口
     // GET -访客信息库
const getBlackAndWhite = (pagesize, page) => transmitGet(`${getVisitorRootAPI()}/blackAndWhite/selects/${pagesize}/${page}`);

     // PUT -回退黑白名单
const resetBlackAndWhite = (params,visitorId) => transmitPut(`${getVisitorRootAPI()}/blackAndWhite/deleteBlackAndWhite/${visitorId}`,params);
     // PUT -新增黑名单
const updateBlack = (params,visitorId) => transmitPut(`${getVisitorRootAPI()}/blackAndWhite/insertBlack/${visitorId}`,params);
     // PUT -新增白名单
const updateWhite = (params,visitorId) => transmitPut(`${getVisitorRootAPI()}/blackAndWhite/updateWhite/${visitorId}`,params);


export default {
     getBlackAndWhite,
     resetBlackAndWhite,
     updateBlack,
     updateWhite,
}