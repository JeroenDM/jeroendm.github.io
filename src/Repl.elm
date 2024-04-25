port module Repl exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, onInput)


main =
    Browser.element { init = init,  subscriptions = subscriptions, update = update, view = view}

port executeCode : String -> Cmd msg
port getResult : (String -> msg) -> Sub msg

type alias Model =
    { userInput : String, output : List String }


init : () -> (Model, Cmd msg)
init flags =
    ({ userInput = "", output = ["one", "two"] }, Cmd.none)


type Msg
    = OnInput String | RunCode  | Recv String


update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        OnInput newInput ->
            ({ model | userInput = newInput }, Cmd.none)
        RunCode ->
            ({ model | userInput = "" }, executeCode model.userInput)
        Recv res ->
            ({ model | output = res :: model.output }, Cmd.none)
  

subscriptions : Model -> Sub Msg
subscriptions model =
    getResult Recv

viewOutput : String -> Html Msg
viewOutput line = 
  div [class "row"] [text line]

view : Model -> Html Msg
view model =
    div [ class "content" ]
        [ h1 [] [ text "Lox repl" ]
        , input [ type_ "text", placeholder "1 + 1", value model.userInput, onInput OnInput ] []
        , button [onClick RunCode] [text "submit"]
        , div [class "output"] (List.map viewOutput model.output)
        ]
