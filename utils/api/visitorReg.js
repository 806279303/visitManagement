import { getVisitorRootAPI } from '../network/service';
import { transmitGet, transmitPost, transmitPut, transmitDelete } from '../network/network';





//访客预约接口
     //GET -获取受访者
const getAllVisitedApi = (pagesize, page) => transmitGet(`${getVisitorRootAPI()}/yun/selectAll/${pagesize}/${page}`);
     //GET -获取受访者
const getAccomVisitedApi = (followName, userId) => transmitGet(`${getVisitorRootAPI()}/visitorRegisteration/searchFollowed/${followName}/${userId}`);
     //GET -获取所有楼宇信息
const getAllBuildingApi = () => transmitGet(`${getVisitorRootAPI()}yun/building`);

     // GET -访客记录
const getVisitorRegApi = (pagesize, page) => transmitGet(`${getVisitorRootAPI()}/visitorRegisteration/select/${pagesize}/${page}`);
     // GET -预约管理查询
const searchVisitorRegApi = (pagesize, page) => transmitGet(`${getVisitorRootAPI()}/visitorRegisteration/selectRegister/${pagesize}/${page}`);
     // GET -查询访客
const getVisitorHisApi = (visitorId) => transmitGet(`${getVisitorRootAPI()}/visitorRegisteration/select/history/${visitorId}`);
     // GET -查询访客
const getVisitorManageApi = (userId) => transmitGet(`${getVisitorRootAPI()}/visitorRegisteration/select/manage/${userId}`);


     // POST -添加随行
const insertFollowedApi = (params,registerationId,userId) => transmitPost(`${getVisitorRootAPI()}/visitorRegisteration/insertFollowed/${registerationId}/${userId}`,params);
     // POST -添加预约
const insertVisitorApi = (params) => transmitPost(`${getVisitorRootAPI()}visitorRegisteration/insertApp`,params);


     // POST -受访者受访确认
const updateVisitedInfoApi = (params) => transmitPost(`${getVisitorRootAPI()}/visitorRegisteration/updateRegisteration`,params);

     // PUT -取消预约
const resetVisitedInfoApi = (registerationId,params = {}) => transmitPut(`${getVisitorRootAPI()}/visitorRegisteration/delete/${registerationId}`,params);
     // PUT -受访者批量受访确认
const updateBatchVisitedInfoApi = (params) => transmitPut(`${getVisitorRootAPI()}/visitorRegisteration/updateBatch`,params);


export default {
     getAllVisitedApi,
     getAccomVisitedApi,
     getAllBuildingApi,
     getVisitorHisApi,
     getVisitorManageApi,
     getVisitorRegApi,
     searchVisitorRegApi,
     insertFollowedApi,
     insertVisitorApi,
     updateVisitedInfoApi,
     resetVisitedInfoApi,
     updateBatchVisitedInfoApi
}