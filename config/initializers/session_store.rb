# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_raflcon_session',
  :secret      => '248a5efc5b161aca27cef10689a7fb7997f260e782bb1dbf6299c8c18c1fcc2dc7c34463361f101a47c7b38d8d92eff36cd09945df004f96556cfe427580d4d3'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
