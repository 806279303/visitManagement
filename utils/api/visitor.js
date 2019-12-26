import { getVisitorRootAPI } from '../network/service';
import { transmitGet, transmitPost, transmitPut, transmitDelete } from '../network/network';



//访客身份信息接口
     // GET -分页模糊查询访客信息库
// const getVisitorInfoApi = (pagesize, page) => transmitGet(`${getVisitorRootAPI()}/visitorBasicinfo/selects/${pagesize}/${page}`);
     // GET -查询访客
const searchVisitorInfoApi = (visitorId) => transmitGet(`${getVisitorRootAPI()}/visitorBasicinfo/visitorsList/${visitorId}`);

     // GET -查询访客历史
const getVisitorHisApi = (pagesize, page) => transmitGet(`${getVisitorRootAPI()}/visitorRegisteration/select/${pagesize}/${page}`);



     // 访客信息POST -添加访客
const insertVisitorInfoApi = (params) => transmitPost(`${getVisitorRootAPI()}/visitorBasicinfo/insert`,params);
     // 访客信息POST -上传照片
const uploadVisitorInfoApi = (params) => transmitPost(`${getVisitorRootAPI()}/visitorBasicinfo/uploadImage`,params);

     // 访客信息PUT -更新访客基本信息
const putVisitorInfoApi = (params) => transmitPut(`${getVisitorRootAPI()}/visitorBasicinfo/updateVisitorBasicInfo`,params);
 
     // 访客信息DELETE -删除访客基本信息
const delVisitorInfoApi = (params) => transmitDelete(`${getVisitorRootAPI()}/visitorBasicinfo/deleteTeacherBasicInfo/${visitorId}`,params);



export default {
     searchVisitorInfoApi,
     insertVisitorInfoApi,
     uploadVisitorInfoApi,
     putVisitorInfoApi,
     delVisitorInfoApi
}