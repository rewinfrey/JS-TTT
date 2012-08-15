require 'sinatra'

get "/" do
  erb :game_board
end

get "/cobras" do
  erb :cobras
end
