import LocalCtrlMgr from './model_local_ctrl_mgr';
import LocalTeachMgr from './model_local_teach_mgr';
import LocalPaintMgr from './model_local_paint_mgr';
import LocalBlocklyMgr from './model_local_blockly_mgr';
import LocalCommonStatusMgr from './model_local_common_status_mgr';

const Model = {};

Model.localCtrlMgr = LocalCtrlMgr;
Model.localCtrlMgr.model = Model;

Model.localTeachMgr = LocalTeachMgr;
Model.localTeachMgr.model = Model;

Model.localPaintMgr = LocalPaintMgr;
Model.localPaintMgr.model = Model;

Model.localBlocklyMgr = LocalBlocklyMgr;
Model.localBlocklyMgr.model = Model;

Model.localBlocklyMgr = LocalBlocklyMgr;
Model.localBlocklyMgr.model = Model;

Model.localCommonStatusMgr = LocalCommonStatusMgr;
Model.localCommonStatusMgr.model = Model;

export default Model;
