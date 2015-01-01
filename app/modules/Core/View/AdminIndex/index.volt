{#
  +------------------------------------------------------------------------+
  | PhalconEye CMS                                                         |
  +------------------------------------------------------------------------+
  | Copyright (c) 2013-2014 PhalconEye Team (http://phalconeye.com/)       |
  +------------------------------------------------------------------------+
  | This source file is subject to the New BSD License that is bundled     |
  | with this package in the file LICENSE.txt.                             |
  |                                                                        |
  | If you did not receive a copy of the license and are unable to         |
  | obtain it through the world-wide-web, please send an email             |
  | to license@phalconeye.com so we can send you a copy immediately.       |
  +------------------------------------------------------------------------+
  | Author: Ivan Vorontsov <ivan.vorontsov@phalconeye.com>                 |
  +------------------------------------------------------------------------+
#}

{% extends "layouts/admin.volt" %}

{% block title %}Admin panel{% endblock %}

{% block head %}
	{#
    {{ helper('assets').addJs('assets/js/core/admin/dashboard.js') }}
    #}
    {{ helper('assets').javascriptInclude('assets/js/core/admin/dashboard.js') }}
{% endblock %}
{% block header %}
<h1>Dashboard</h1>
{% endblock %}
{% block content %}
<div class="row">
	<div class="col-lg-8 col-sm-12 col-xs-12">
	    <div class="row">
			<div class="col-lg-12">
			    <div class="widget">
				<div class="widget-header bordered-bottom bordered-themesecondary">
				    <i class="widget-icon fa fa-tags themesecondary"></i>
				    <span class="widget-caption themesecondary">Ticket Board</span>
				</div><!--Widget Header-->
				<div class="widget-body">
				    <div class="widget-main no-padding">
						<h1>{{ 'Dashboard' |i18n }}</h1>
            			Some activity here... imagine it =)... coming soon (maybe in 0.5.0)...
				    </div>
				</div>
			    </div>

			</div>
	    </div>
	</div>
	<div class="col-lg-4 col-sm-12 col-xs-12">
	    <div class="widget">
		<div class="widget-header bordered-bottom bordered-themeprimary">
		    <i class="widget-icon fa fa-tasks themeprimary"></i>
		    <span class="widget-caption themeprimary">Task Board</span>
		</div><!--Widget Header-->
		<div class="widget-body">
		    <div class="widget-main no-padding text-center">
				<div>
	                <h4>{{ 'Debug mode'|i18n }}</h4>
	                <input name="debug" type="checkbox" data-href="{{ url(['for':'admin-mode'])}}" {% if debug %}checked{% endif %}>
	            </div>
	            <hr>
	            <div>
	                <a href="{{ url(['for':'admin-clear'])}}" class="btn btn-primary">{{ 'Clear cache'|i18n }}</a>
	            </div>
		    </div><!--Widget Main Container-->
		</div><!--Widget Body-->
	    </div>

	</div>
</div>
{% endblock %}
