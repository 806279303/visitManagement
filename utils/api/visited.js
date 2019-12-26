import { getVisitorRootAPI } from '../network/service';
import { transmitGet, transmitPost, transmitPut, transmitDelete } from '../network/network';

//受访者信息接口
     // 受访者信息GET
const getvisitedInfoApi = (pagesize, page) => transmitGet(`${getVisitorRootAPI()}visitedBasicInfo/select/${pagesize}/${page}`);

     // 受访者信息POST
const postvisitedInfoApi = (params) => transmitPost(`${getVisitorRootAPI()}visitedBasicInfo/insertVisitedBasicInfo/`,params);
     // 受访者信息PUT
const putvisitedInfoApi = (params) => transmitPut(`${getVisitorRootAPI()}visitedBasicInfo/updateVisitedBasicInfo/`,params);


export default {
     getvisitedInfoApi,
     postvisitedInfoApi,
     putvisitedInfoApi
}