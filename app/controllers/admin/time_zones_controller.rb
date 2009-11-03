class Admin::TimeZonesController < ApplicationController
  def index
    time_zones = TZInfo::Timezone.all
    @time_zones = time_zones.select { |tz|
      tz.friendly_identifier =~ /#{params[:configuration][:time_zone]}/i
    }.sort_by { |tz|
      [tz.friendly_identifier.size, tz.friendly_identifier]
    }[0..9]
    render :layout => false
  end
end
