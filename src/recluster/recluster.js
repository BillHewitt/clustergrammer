var clusterfck = require('cornhundred-clusterfck');
var core = require('mathjs/core');
var math = core.create();
var dist_fun = require('./distance_functions');
var get_order_and_groups_clusterfck_tree = require('./get_order_and_groups_clusterfck_tree');

math.import(require('mathjs/lib/function/matrix/transpose'));
math.import(require('mathjs/lib/type/matrix'));

module.exports = function recluster(cgm){

  var new_view = {};
  new_view.N_row_sum = 'null';
  new_view.N_row_var = 'null';
  new_view.dist = 'euclidean';
  new_view.nodes = $.extend(true, [], cgm.config.network_data.views[0].nodes);

  _.each(['row', 'col'], function(inst_rc){

    var mat;
    var transpose = math.transpose;
    var names;
    var name_nodes;

    if (inst_rc === 'row'){
      mat = $.extend(true, [], cgm.params.network_data.mat);

      names = cgm.params.network_data.row_nodes_names;
      name_nodes = 'row_nodes';

    } else if (inst_rc === 'col'){
      mat = $.extend(true, [], cgm.params.network_data.mat);
      mat = transpose(mat);

      names = cgm.params.network_data.col_nodes_names;
      name_nodes = 'col_nodes';
    }

    // var dist_type = 'cosine';
    var dist_type = 'euclidean';
    var clusters = clusterfck.hcluster(mat, dist_fun[dist_type]);

    var order_info = get_order_and_groups_clusterfck_tree(clusters, names);
    var inst_node;
    var inst_order;


    // row or column nodes
    var rc_nodes = new_view.nodes[name_nodes];

    for (var index=0; index < rc_nodes.length; index++){
      inst_node = rc_nodes[index];
      inst_order = order_info.info[index];

      inst_node.clust = inst_order.order;
      inst_node.group = inst_order.group;
    }


  });

  // add new view to views
  cgm.config.network_data.views.push(new_view);
  cgm.update_view('dist', 'euclidean');

};