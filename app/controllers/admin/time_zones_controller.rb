class Admin::TimeZonesController < ApplicationController
  def index
    time_zones = TZInfo::Timezone.all
    @time_zones = time_zones.select { |tz|
      tz.friendly_identifier =~ /#{params[:q]}/i
    }.sort_by { |tz|
      [tz.friendly_identifier.size, tz.friendly_identifier]
    }[0..9]
    render(
      json: @time_zones.map { |tz|
        {friendly_identifier: tz.friendly_identifier} 
      }
    )
  end
end
