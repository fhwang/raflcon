class ConferenceController < ApplicationController
  def show
    @conference = Conference.first
    render json: @conference
  end
end
